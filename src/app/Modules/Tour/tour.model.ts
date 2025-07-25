import { model, Schema } from "mongoose";
import { Division } from "../division/division.module";
import { ITour, ITourType } from "./tour.interface";

const tourTypeSchema = new Schema<ITourType>(
  { name: { type: String } },
  { timestamps: true }
);

export const TourType = model<ITourType>("TourType", tourTypeSchema);

const tourSchema = new Schema<ITour>(
  {
    title: { type: String },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    images: { type: [String], default: [] },
    location: { type: String },
    costFrom: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    tourPlan: { type: [String], default: [] },
    maxGust: { type: Number },
    minAge: { type: Number },
    division: { type: Schema.Types.ObjectId, ref: Division, required: true },
    tourType: { type: Schema.Types.ObjectId, ref: TourType, required: true },
  },
  { timestamps: true }
);

export const Tour = model<ITour>("Tour", tourSchema);
