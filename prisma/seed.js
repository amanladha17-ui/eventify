const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 12)
  
  await prisma.user.upsert({
    where: { email: 'admin@eventify.com' },
    update: {},
    create: {
      email: 'admin@eventify.com',
      name: 'Super Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  console.log('Seeding complete. Admin created: admin@eventify.com / admin123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
