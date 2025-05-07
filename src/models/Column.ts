import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IColumn extends Document {
  title: string;
  boardId: Types.ObjectId;
  order: number; // For maintaining column order within a board
}

const ColumnSchema: Schema<IColumn> = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  boardId: {
    type: Schema.Types.ObjectId,
    ref: 'Board',
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

// Index for faster querying of columns by boardId and for ordering
ColumnSchema.index({ boardId: 1, order: 1 });

const Column: Model<IColumn> = mongoose.models.Column || mongoose.model<IColumn>('Column', ColumnSchema);

export default Column;
