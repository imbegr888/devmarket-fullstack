import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Инициализируем Prisma Client напрямую, чтобы избежать проблем с путями
const globalForPrisma = global;
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Укажите корректный Email' },
        { status: 400 }
      );
    }

    // Проверка наличия подписчика
    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: true, message: 'Этот Email уже подписан на рассылку!' });
    }

    const subscriber = await prisma.subscriber.create({
      data: { email },
    });

    return NextResponse.json(
      { success: true, data: subscriber, message: 'Вы успешно подписались на рассылку новостей!' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}