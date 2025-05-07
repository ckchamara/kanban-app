import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Board from '@/models/Board';
import { Types } from 'mongoose';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userId = session.user.id;
    const { title } = await req.json();

    if (!title) {
      return new NextResponse('Title is required', { status: 400 });
    }

    await dbConnect();

    const newBoard = new Board({
      title,
      userId: new Types.ObjectId(userId), // Ensure userId is an ObjectId
    });

    await newBoard.save();

    return NextResponse.json(newBoard, { status: 201 }); // Created
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userId = session.user.id;

    await dbConnect();

    const boards = await Board.find({ userId: new Types.ObjectId(userId) }); // Find boards for the current user

    return NextResponse.json(boards);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
