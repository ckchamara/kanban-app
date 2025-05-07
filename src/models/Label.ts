import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface ILabel extends Document {
  name: string;
  color: string;
  userId: Types.ObjectId; // To scope labels to a user
}

const LabelSchema: Schema<ILabel> = new Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true, // Should be a hex code or a recognized color name
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

// Index for faster querying of labels by user
LabelSchema.index({ userId: 1, name: 1 }, { unique: true }); // A user cannot have two labels with the same name

const Label: Model<ILabel> = mongoose.models.Label || mongoose.model<ILabel>('Label', LabelSchema);

export default Label;
