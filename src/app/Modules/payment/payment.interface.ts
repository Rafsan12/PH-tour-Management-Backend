/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";

export enum PAYMENT_STATUS {
  PAID = "PAID",
  UNPAID = "UNPAID",
  CANCELED = "CANCELED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export interface IPayment {
  booking: Types.ObjectId;
  transactionId: string;
  status: PAYMENT_STATUS;
  amount: number;
  paymentGatewayData?: any;
  invoiceUrl?: string;
}
