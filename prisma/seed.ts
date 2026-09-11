import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.upsert({
    where: { id: 'dev-user' },
    update: {},
    create: {
      id: 'dev-user',
      email: 'dev@example.com',
      name: 'Dev User',
    },
  })
  console.log('Seeded dev user:', user.id, user.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())