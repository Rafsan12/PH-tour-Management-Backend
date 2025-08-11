import httpStatus from "http-status-codes";
import AppError from "../../ErrorHelper/AppError";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { Tour } from "../Tour/tour.model";
import { User } from "../User/user.model";
import { Booking } from "./booing.model";
import { Booking_Status, IBooking } from "./booking.interface";

const generateId = () => {
  return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const transactionId = generateId();

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId);
    if (!user?.phone || user.address) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Please Update your Profile for Book a Tour"
      );
    }
    const tour = await Tour.findById(payload.tour).select("costFrom");

    if (!tour?.costFrom) {
      throw new AppError(httpStatus.BAD_REQUEST, "No Tour Cost Found");
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const amount = Number(tour?.costFrom) * Number(payload.gustCount!);

    const booking = await Booking.create(
      [
        {
          user: userId,
          status: Booking_Status.PENDING,
          ...payload,
        },
      ],
      { session }
    );

    const payment = await Payment.create(
      [
        {
          booking: booking[0]._id,
          status: PAYMENT_STATUS.UNPAID,
          transactionId: transactionId,
          amount: amount,
        },
      ],
      { session }
    );

    const updateBooking = await Booking.findByIdAndUpdate(
      booking[0]._id,

      {
        payment: payment[0]._id,
      },

      { new: true, runValidators: true, session }
    ).populate("user", "name,email, phone, address");
    await session.commitTransaction();
    session.endSession();
    return updateBooking;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const BookingService = {
  createBooking,
};
