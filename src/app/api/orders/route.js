import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { productId, userEmail } = body;

    if (!productId || !userEmail) {
      return NextResponse.json(
        { success: false, error: 'Не указан productId или userEmail' },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        productId,
        userEmail,
      },
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}