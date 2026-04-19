import { db } from './index'
import { users, categories, restaurantInfo } from './schema'
import bcrypt from 'bcryptjs'

async function seed() {
  console.log('🌱 Seeding database...')

  // 1. Clear existing data (optional, but good for clean seed)
  // await db.delete(users)
  // await db.delete(categories)
  // await db.delete(restaurantInfo)

  // 2. Hash passwords
  const adminPassword = await bcrypt.hash('Admin@123', 10)
  const receptionPassword = await bcrypt.hash('Reception@123', 10)
  const kitchenPassword = await bcrypt.hash('Kitchen@123', 10)

  // 3. Insert Users
  console.log('👤 Inserting users...')
  await db.insert(users).values([
    {
      name: 'Admin User',
      email: 'admin@swadanusar.com',
      passwordHash: adminPassword,
      role: 'admin',
    },
    {
      name: 'Reception User',
      email: 'reception@swadanusar.com',
      passwordHash: receptionPassword,
      role: 'reception',
    },
    {
      name: 'Kitchen User',
      email: 'kitchen@swadanusar.com',
      passwordHash: kitchenPassword,
      role: 'kitchen',
    },
  ]).onConflictDoNothing()

  // 4. Insert Restaurant Info
  console.log('🏠 Inserting restaurant info...')
  await db.insert(restaurantInfo).values({
    name: 'Swad Anusar',
    address: 'Govindpuri, Gwalior (MP)',
    themeColor: '#B5451B',
    accentColor: '#F4A261',
    slug: 'swad-anusar',
  }).onConflictDoNothing()

  // 5. Insert Default Categories
  console.log('🥘 Inserting categories...')
  const categoryList = [
    { name: '🌅 Breakfast', displayOrder: 1 },
    { name: '🍱 Lunch', displayOrder: 2 },
    { name: '🌙 Dinner', displayOrder: 3 },
    { name: '🥗 Starters', displayOrder: 4 },
    { name: '🍛 Main Course', displayOrder: 5 },
    { name: '🥪 Snacks', displayOrder: 6 },
    { name: '🍨 Desserts', displayOrder: 7 },
    { name: '🥤 Beverages', displayOrder: 8 },
    { name: '⭐ Chef\'s Special', displayOrder: 9 },
  ]

  await db.insert(categories).values(categoryList).onConflictDoNothing()

  console.log('✅ Seeding complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err)
  process.exit(1)
})
