import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  description: string;
  imageUrl?: string;
  blogPost: string;
  date: string; // ISO date string preferred, but keeping string for consistency with current data
  type: 'project' | 'blog';
  wordCount?: number;
  readTime?: number;
  links?: Array<{
    text: string;
    url: string;
  }>;
  slug: string; // Add slug for easier routing
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    blogPost: { type: String, required: true }, // The markdown content
    date: { type: String, required: true },
    type: { type: String, enum: ['project', 'blog'], required: true },
    wordCount: { type: Number },
    readTime: { type: Number },
    links: [
      {
        text: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    slug: { type: String, unique: true },
  },
  {
    timestamps: true,
  }
);

// Check if model exists to prevent overwrite error in hot reload
const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);

export default Blog;
