const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        title: 'Telegram Bot Scraper',
        description: 'Парсер каналов с отправкой аналитики в Telegram',
        price: 2500,
        category: 'Python',
      },
      {
        title: 'React Dashboard UI',
        description: 'Готовый шаблон админки на Next.js и Tailwind CSS',
        price: 4000,
        category: 'Frontend',
      },
      {
        title: 'Docker Deployment Script',
        description: 'Автоматический деплой приложений на VPS через Bash и Docker',
        price: 1500,
        category: 'DevOps',
      },
    ],
  });

  console.log('База данных успешно заполнена тестовыми товарами!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });