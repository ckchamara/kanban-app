import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IBoard extends Document {
  title: string;
  userId: Types.ObjectId;
  // createdAt will be added by timestamps
}

const BoardSchema: Schema<IBoard> = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

// Index for faster querying of boards by user
BoardSchema.index({ userId: 1 });

const Board: Model<IBoard> = mongoose.models.Board || mongoose.model<IBoard>('Board', BoardSchema);

export default Board;
