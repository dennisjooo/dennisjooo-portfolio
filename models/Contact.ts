import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: [true, "Please provide a label for the contact."],
      maxlength: [50, "Label cannot be more than 50 characters"],
    },
    href: {
      type: String,
      required: [true, "Please provide the contact URL or link."],
    },
    icon: {
      type: String,
      required: [true, "Please provide an icon name."],
      enum: ["mail", "github", "linkedin", "twitter", "instagram", "youtube", "website"],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Contact ||
  mongoose.model("Contact", ContactSchema);
