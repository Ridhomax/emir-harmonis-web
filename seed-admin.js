const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@emir.com';
  const password = 'admin123';
  
  const existingAdmin = await prisma.user.findUnique({ where: { email } });
  
  if (existingAdmin) {
    console.log('Admin already exists.');
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: email,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin created successfully:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
