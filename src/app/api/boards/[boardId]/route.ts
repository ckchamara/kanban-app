import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Board from '@/models/Board';
import { Types } from 'mongoose';

interface Params {
  boardId: string;
}

export async function GET(req: Request, { params }: { params: Params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userId = session.user.id;
    const { boardId } = params;

    if (!boardId) {
      return new NextResponse('Board ID is required', { status: 400 });
    }

    await dbConnect();

    const board = await Board.findOne({ _id: boardId, userId: new Types.ObjectId(userId) }); // Ensure board belongs to user

    if (!board) {
      return new NextResponse('Board not found', { status: 404 });
    }

    return NextResponse.json(board);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userId = session.user.id;
    const { boardId } = params;
    const { title } = await req.json();

    if (!boardId) {
      return new NextResponse('Board ID is required', { status: 400 });
    }

    if (!title) {
      return new NextResponse('Title is required', { status: 400 });
    }

    await dbConnect();

    const board = await Board.findOneAndUpdate(
      { _id: boardId, userId: new Types.ObjectId(userId) }, // Ensure board belongs to user
      { title },
      { new: true } // Return the updated document
    );

    if (!board) {
      return new NextResponse('Board not found', { status: 404 });
    }

    return NextResponse.json(board);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userId = session.user.id;
    const { boardId } = params;

    if (!boardId) {
      return new NextResponse('Board ID is required', { status: 400 });
    }

    await dbConnect();

    const board = await Board.findOneAndDelete({ _id: boardId, userId: new Types.ObjectId(userId) }); // Ensure board belongs to user

    if (!board) {
      return new NextResponse('Board not found', { status: 404 });
    }

    return new NextResponse(null, { status: 204 }); // No content (successful delete)
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
