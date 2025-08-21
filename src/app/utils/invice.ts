/* eslint-disable @typescript-eslint/no-explicit-any */
import PDFDocument from "pdfkit";
import AppError from "../ErrorHelper/AppError";

export interface IInvoiceData {
  transactionId: string;
  bookingDate: Date | string; // allow string too, since runtime often gives string
  userName: string;
  tourTitle: string;
  guestCount: number;
  totalAmount: number;
}

const generatePDF = async (
  invoiceData: IInvoiceData
): Promise<Buffer<ArrayBufferLike>> => {
  try {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffer: Uint8Array[] = [];

      doc.on("data", (chunk) => buffer.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffer)));
      doc.on("error", (err) => reject(err));

      // ===== HEADER =====
      doc.fontSize(22).fillColor("#007ACC").text("Travel Explorer", 50, 50);
      doc
        .fontSize(10)
        .fillColor("#444")
        .text("123 Dream Street", 50, 75)
        .text("Dhaka, Bangladesh", 50, 90)
        .text("Email: info@travelexplorer.com", 50, 105);

      // Invoice Title
      doc
        .fontSize(20)
        .fillColor("#000")
        .text("INVOICE", 400, 50, { align: "right" });

      // ===== FORMAT BOOKING DATE SAFELY =====
      const bookingDate = new Date(invoiceData.bookingDate);
      const formattedDate = bookingDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      // ===== INVOICE META =====
      doc
        .fontSize(12)
        .fillColor("#444")
        .text(`Invoice #: ${invoiceData.transactionId}`, 400, 80, {
          align: "right",
        })
        .text(`Date: ${formattedDate}`, 400, 95, { align: "right" })
        .text(`Customer: ${invoiceData.userName}`, 400, 110, {
          align: "right",
        });

      doc.moveDown(4);

      // ===== TABLE HEADER =====
      const tableTop = 200;
      const itemX = 50;
      const guestX = 250;
      const priceX = 350;
      const totalX = 450;

      doc
        .fontSize(12)
        .fillColor("#000")
        .text("Description", itemX, tableTop)
        .text("Guests", guestX, tableTop, { width: 90, align: "right" })
        .text("Price/Guest", priceX, tableTop, { width: 90, align: "right" })
        .text("Total", totalX, tableTop, { width: 90, align: "right" });

      // Divider
      doc
        .moveTo(50, tableTop + 15)
        .lineTo(550, tableTop + 15)
        .strokeColor("#CCCCCC")
        .stroke();

      // ===== TABLE ROW (Booking Data) =====
      const rowY = tableTop + 30;
      const pricePerGuest = invoiceData.totalAmount / invoiceData.guestCount;

      doc
        .fontSize(12)
        .fillColor("#444")
        .text(invoiceData.tourTitle, itemX, rowY)
        .text(`${invoiceData.guestCount}`, guestX, rowY, {
          width: 90,
          align: "right",
        })
        .text(`$${pricePerGuest.toFixed(2)}`, priceX, rowY, {
          width: 90,
          align: "right",
        })
        .text(`$${invoiceData.totalAmount.toFixed(2)}`, totalX, rowY, {
          width: 90,
          align: "right",
        });

      // ===== SUMMARY =====
      const summaryY = rowY + 50;
      doc
        .fontSize(12)
        .fillColor("#000")
        .text("Subtotal:", 350, summaryY, { width: 90, align: "right" })
        .text(`$${invoiceData.totalAmount.toFixed(2)}`, totalX, summaryY, {
          width: 90,
          align: "right",
        });

      doc
        .fontSize(12)
        .text("Tax (0%):", 350, summaryY + 20, { width: 90, align: "right" })
        .text("$0.00", totalX, summaryY + 20, { width: 90, align: "right" });

      // Final Total (Highlighted)
      doc
        .fontSize(14)
        .fillColor("#28a745")
        .text("TOTAL:", 350, summaryY + 50, { width: 90, align: "right" })
        .text(`$${invoiceData.totalAmount.toFixed(2)}`, totalX, summaryY + 50, {
          width: 90,
          align: "right",
        });

      // ===== FOOTER =====
      doc
        .fontSize(12)
        .fillColor("#555")
        .text("Thank you for booking with Travel Explorer!", 50, 700, {
          align: "center",
        })
        .text("www.travelexplorer.com", 50, 715, {
          align: "center",
          link: "http://your-website.com",
        });

      doc.end();
    });
  } catch (error: any) {
    throw new AppError(401, `Pdf creation error ${error.message}`);
  }
};

export default generatePDF;
