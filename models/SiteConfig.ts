import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISiteConfig extends Document {
  profileImageUrl: string;
}

const SiteConfigSchema: Schema = new Schema(
  {
    profileImageUrl: { type: String, default: '/images/profile.webp' },
  },
  {
    timestamps: true,
  }
);

const SiteConfig: Model<ISiteConfig> = mongoose.models.SiteConfig || mongoose.model<ISiteConfig>('SiteConfig', SiteConfigSchema);

export default SiteConfig;
