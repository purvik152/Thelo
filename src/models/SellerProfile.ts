/*
* =================================================================================================
* FILE: src/models/SellerProfile.ts
*
* ACTION: Create this file inside your 'src/models' folder.
* This model stores extra information ONLY for users with the 'seller' role.
* Creating this file will fix the import error in your API.
* =================================================================================================
*/
import mongoose, { Schema, Document } from 'mongoose';

export interface ISellerProfile extends Document {
  user: Schema.Types.ObjectId; // Reference to the main User document
  brandName: string;
  businessAddress: string;
  gstNumber?: string; // Optional field
}

const SellerProfileSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // This creates the link to the User model
    required: true,
    unique: true, // Ensures one seller profile per user
  },
  brandName: {
    type: String,
    required: [true, 'Please provide your brand name.'],
    trim: true,
  },
  businessAddress: {
    type: String,
    required: [true, 'Please provide your business address.'],
  },
  gstNumber: {
    type: String,
  },
}, { timestamps: true });

export default mongoose.models.SellerProfile || mongoose.model<ISellerProfile>('SellerProfile', SellerProfileSchema);
