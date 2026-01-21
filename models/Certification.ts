import mongoose from "mongoose";

const CertificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title for the certification."],
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    issuer: {
      type: String,
      required: [true, "Please provide the issuer name."],
      maxlength: [100, "Issuer cannot be more than 100 characters"],
    },
    date: {
      type: String,
      required: [true, "Please provide the date/year."],
    },
    description: {
      type: String,
      required: [true, "Please provide a description."],
    },
    link: {
      type: String,
      required: [true, "Please provide a certificate URL."],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Certification ||
  mongoose.model("Certification", CertificationSchema);
