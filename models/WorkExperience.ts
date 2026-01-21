import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWorkExperience extends Document {
  title: string;
  company: string;
  date: string;
  imageSrc: string;
  responsibilities: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const WorkExperienceSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    date: { type: String, required: true },
    imageSrc: { type: String, required: true },
    responsibilities: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const WorkExperience: Model<IWorkExperience> = 
  mongoose.models.WorkExperience || 
  mongoose.model<IWorkExperience>('WorkExperience', WorkExperienceSchema);

export default WorkExperience;
