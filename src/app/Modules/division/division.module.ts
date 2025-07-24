import { model, Schema } from "mongoose";
import { iDivision } from "./division.interface";

const divisionSchema = new Schema<iDivision>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    thumbnail: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

export const Division = model<iDivision>("Division", divisionSchema);
