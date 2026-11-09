import 'dotenv/config'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { connectDb } from './db.js'
import { User } from './models/User.js'
import { Item } from './models/Item.js'
import { Claim } from './models/Claim.js'
import { ClaimHistory } from './models/ClaimHistory.js'

async function main() {
    await connectDb()

    await Promise.all([
        User.deleteMany({}),
        Item.deleteMany({}),
        Claim.deleteMany({}),
        ClaimHistory.deleteMany({}),
    ])

    const passwordHash = await bcrypt.hash('password123', 10)

    const [admin, alice, bob] = await User.create([
        { name: 'Admin', email: 'admin@university.edu', passwordHash, role: 'admin' },
        { name: 'Alice', email: 'user1@university.edu', passwordHash, role: 'user' },
        { name: 'Bob', email: 'user2@university.edu', passwordHash, role: 'user' },
    ])

    const [backpack, airpods, bottle] = await Item.create([
        {
            userId: alice._id,
            name: 'Black Backpack',
            category: 'Other',
            location: 'Student Center',
            status: 'Lost',
            lifecycle: 'Claim Requested',
            date: '2026-10-03',
            description:
                'Black backpack reported missing from the Student Center.',
        },
        {
            userId: alice._id,
            name: 'Apple AirPods',
            category: 'Electronics',
            location: 'Library',
            status: 'Found',
            lifecycle: 'Claim Requested',
            date: '2026-10-02',
            description:
                'Apple AirPods found near the library study area.',
        },
        {
            userId: alice._id,
            name: 'Blue Water Bottle',
            category: 'Other',
            location: 'Engineering Building',
            status: 'Lost',
            lifecycle: 'Active',
            date: '2026-10-01',
            description:
                'Blue water bottle reported missing from the Engineering Building.',
        },
    ])

    await Claim.create([
        {
            itemId: backpack._id,
            claimantId: bob._id,
            description:
                'Black backpack with a laptop compartment and a small campus sticker on the front.',
        },
        {
            itemId: airpods._id,
            claimantId: bob._id,
            description:
                'Claimant provided identifying information for the AirPods.',
        },
    ])

    console.log('Seed complete.')
    console.log('Logins (password: password123):')
    console.log('  admin@university.edu  (admin)')
    console.log('  user1@university.edu  (reporter: Alice)')
    console.log('  user2@university.edu  (claimant: Bob)')

    await mongoose.disconnect()
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})