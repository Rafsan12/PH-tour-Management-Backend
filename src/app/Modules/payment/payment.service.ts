/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";

import AppError from "../../ErrorHelper/AppError";
import generatePDF, { IInvoiceData } from "../../utils/invice";
import { sendEmail } from "../../utils/sendEmail";
import { Booking } from "../booking/booing.model";
import { Booking_Status } from "../booking/booking.interface";
import { ISSL } from "../SSL/SSL.interface";
import { SSLService } from "../SSL/SSL.service";
import { ITour } from "../Tour/tour.interface";
import { IUser } from "../User/user.interface";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";

const initPayment = async (bookingId: string) => {
  const payment = await Payment.findOne({ booking: bookingId });

  if (!payment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Payment Not Found. You have not booked this tour"
    );
  }

  const booking = await Booking.findById(payment.booking);

  const userAddress = (booking?.user as any).address;
  const userEmail = (booking?.user as any).email;
  const userPhoneNumber = (booking?.user as any).phone;
  const userName = (booking?.user as any).name;

  const sslPayload: ISSL = {
    address: userAddress,
    email: userEmail,
    phoneNumber: userPhoneNumber,
    name: userName,
    amount: payment.amount,
    transactionId: payment.transactionId,
  };

  const sslPayment = await SSLService.SSLPaymentInit(sslPayload);

  return {
    paymentUrl: sslPayment.GatewayPageURL,
  };
};

const successPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    // Update payment status
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.PAID },
      { new: true, runValidators: true, session }
    );

    if (!updatedPayment) throw new AppError(401, "Payment not found");

    // Update booking status
    const updateBooking = await Booking.findByIdAndUpdate(
      updatedPayment.booking,
      { status: Booking_Status.COMPLETE },
      { new: true, runValidators: true, session }
    )
      .populate("tour", "title")
      .populate("user", "name email");

    if (!updateBooking) throw new AppError(401, "Booking not found");
    if (!updateBooking.user || !updateBooking.tour) {
      throw new AppError(401, "Booking user or tour not found");
    }

    // Prepare invoice data
    const invoiceData: IInvoiceData = {
      bookingDate: updateBooking.createdAt as Date,
      guestCount: updateBooking.guestCount,
      totalAmount: updatedPayment.amount,
      tourTitle: (updateBooking.tour as unknown as ITour).title,
      transactionId: updatedPayment.transactionId,
      userName: (updateBooking.user as unknown as IUser).name,
    };

    // Generate PDF
    const pdfBuffer = await generatePDF(invoiceData);

    // Commit transaction
    await session.commitTransaction();

    // End session
    session.endSession();

    // Send email (outside transaction)
    try {
      await sendEmail({
        to: (updateBooking.user as unknown as IUser).email,
        subject: "Your Booking Invoice",
        templateName: "invoice",
        templateData: invoiceData,
        attachments: [
          {
            filename: "invoice.pdf",
            content: pdfBuffer,
            // encoding: "base64",
            contentType: "application/pdf",
          },
        ],
      });
    } catch (emailError) {
      // Log email error but don't throw to ensure success response
      console.error("Failed to send email:", emailError);
      // Optionally, you can notify the user that the email failed but payment was successful
    }

    return { success: true, message: "Payment Completed Successfully" };
  } catch (error) {
    // Only abort transaction if it hasn't been committed
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const failPayment = async (query: Record<string, string>) => {
  // Update Booking Status to FAIL
  // Update Payment Status to FAIL

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.FAILED,
      },
      { new: true, runValidators: true, session: session }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: Booking_Status.FAILED },
      { runValidators: true, session }
    );

    await session.commitTransaction(); //transaction
    session.endSession();
    return { success: false, message: "Payment Failed" };
  } catch (error) {
    await session.abortTransaction(); // rollback
    session.endSession();
    // throw new AppError(httpStatus.BAD_REQUEST, error) ❌❌
    throw error;
  }
};
const cancelPayment = async (query: Record<string, string>) => {
  // Update Booking Status to CANCEL
  // Update Payment Status to CANCEL

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.CANCELLED,
      },
      { runValidators: true, session: session }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: Booking_Status.CANCEL },
      { runValidators: true, session }
    );

    await session.commitTransaction(); //transaction
    session.endSession();
    return { success: false, message: "Payment Cancelled" };
  } catch (error) {
    await session.abortTransaction(); // rollback
    session.endSession();
    // throw new AppError(httpStatus.BAD_REQUEST, error) ❌❌
    throw error;
  }
};

export const PaymentService = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
};
