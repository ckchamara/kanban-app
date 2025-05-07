import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface ICard extends Document {
  title: string;
  description?: string;
  columnId: Types.ObjectId;
  boardId: Types.ObjectId; // Added for easier querying and ensuring card belongs to the correct board context
  order: number; // For maintaining card order within a column
  dueDate?: Date;
  labels: Types.ObjectId[]; // Array of Label ObjectIds
}

const CardSchema: Schema<ICard> = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  columnId: {
    type: Schema.Types.ObjectId,
    ref: 'Column',
    required: true,
  },
  boardId: { // Denormalized for easier access, can be derived from columnId.boardId if needed
    type: Schema.Types.ObjectId,
    ref: 'Board',
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  dueDate: {
    type: Date,
  },
  labels: [{
    type: Schema.Types.ObjectId,
    ref: 'Label',
  }],
}, { timestamps: true });

// Index for faster querying of cards
CardSchema.index({ columnId: 1, order: 1 });
CardSchema.index({ boardId: 1 }); // For fetching all cards of a board

const Card: Model<ICard> = mongoose.models.Card || mongoose.model<ICard>('Card', CardSchema);

export default Card;
