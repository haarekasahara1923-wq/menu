import 'dotenv/config'
import { db } from './index'
import { users, categories, dishes, restaurantInfo } from './schema'
import bcrypt from 'bcryptjs'

async function seed() {
  console.log('🌱 Seeding database...')

  // 1. Hash passwords
  const adminPassword = await bcrypt.hash('Admin@123', 10)
  const staffPassword = await bcrypt.hash('Staff@123', 10)

  // 2. Insert Users
  console.log('👤 Inserting users...')
  await db.insert(users).values([
    { name: 'Admin User', email: 'admin@swadanusar.com', passwordHash: adminPassword, role: 'admin' },
    { name: 'Reception User', email: 'reception@swadanusar.com', passwordHash: staffPassword, role: 'reception' },
    { name: 'Kitchen User', email: 'kitchen@swadanusar.com', passwordHash: staffPassword, role: 'kitchen' },
  ]).onConflictDoNothing()

  // 3. Insert Restaurant Info
  console.log('🏠 Inserting restaurant info...')
  await db.insert(restaurantInfo).values({
    name: 'Swad Anusar',
    address: 'Govindpuri, Gwalior (MP)',
    themeColor: '#B5451B',
    accentColor: '#F4A261',
    slug: 'swad-anusar',
  }).onConflictDoNothing()

  // 4. Insert Categories & Dishes
  console.log('🥘 Seeding categories and dishes...')
  const cats = [
    { name: '🌅 Breakfast', order: 1 },
    { name: '🥗 Starters', order: 2 },
    { name: '🍛 Main Course', order: 3 },
    { name: '🥤 Beverages', order: 4 },
  ]

  for (const catData of cats) {
    const [insertedCat] = await db.insert(categories).values({
      name: catData.name,
      displayOrder: catData.order,
      isActive: true,
    }).returning({ id: categories.id })

    // Add dishes for this category
    if (catData.name.includes('Breakfast')) {
      await db.insert(dishes).values([
        { 
            categoryId: insertedCat.id, 
            name: 'Masala Dosa', 
            description: 'Crispy rice pancake with potato filling', 
            isVeg: true, 
            sizes: [{ label: 'Standard', price: 120 }],
            images: ['https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=800&auto=format&fit=crop']
        },
        { 
            categoryId: insertedCat.id, 
            name: 'Poha Jalebi', 
            description: 'Indori special beaten rice with sweet jalebi', 
            isVeg: true, 
            sizes: [{ label: 'Standard', price: 60 }] 
        },
      ])
    } else if (catData.name.includes('Main Course')) {
      await db.insert(dishes).values([
        { 
            categoryId: insertedCat.id, 
            name: 'Paneer Butter Masala', 
            description: 'Creamy tomato based paneer curry', 
            isVeg: true, 
            sizes: [{ label: 'Half', price: 180 }, { label: 'Full', price: 320 }] 
        },
        { 
            categoryId: insertedCat.id, 
            name: 'Dal Makhani', 
            description: 'Slow cooked black lentils with butter', 
            isVeg: true, 
            sizes: [{ label: 'Bowl', price: 150 }] 
        },
      ])
    } else if (catData.name.includes('Starters')) {
        await db.insert(dishes).values([
          { 
              categoryId: insertedCat.id, 
              name: 'Crispy Corn', 
              description: 'Deep fried corn tossed with spices', 
              isVeg: true, 
              sizes: [{ label: 'Plate', price: 140 }] 
          },
        ])
    }
  }

  console.log('✅ Seeding complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err)
  process.exit(1)
})
