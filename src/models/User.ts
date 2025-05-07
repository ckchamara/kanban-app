import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string; // Optional as per NextAuth typical usage
  // emailVerified?: Date | null; // NextAuth might add this
}

const UserSchema: Schema<IUser> = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  // emailVerified: { type: Date, default: null } // Example if needed
}, { timestamps: true }); // Add createdAt and updatedAt timestamps

// Ensure the model is not recompiled if it already exists
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
