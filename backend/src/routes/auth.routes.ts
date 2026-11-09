import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { User } from '../models/User.js'
import { signToken, requireAuth } from '../middleware/auth.js'

export const authRouter = Router()

const registerSchema = z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    password: z.string().min(8).max(100),
})

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
})

authRouter.post('/register', async (req, res, next) => {
    try {
        const { name, email, password } = registerSchema.parse(req.body)

        const existing = await User.findOne({ email: email.toLowerCase() })
        if (existing) {
            return res.status(409).json({ error: 'Email already registered' })
        }

        const passwordHash = await bcrypt.hash(password, 10)
        const user = await User.create({ name, email, passwordHash })

        const token = signToken({
            id: user.id,
            email: user.email,
            role: user.role as 'user' | 'admin',
        })

        res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        })
    } catch (err) {
        next(err)
    }
})

authRouter.post('/login', async (req, res, next) => {
    try {
        const { email, password } = loginSchema.parse(req.body)

        const user = await User.findOne({ email: email.toLowerCase() })
        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }

        const token = signToken({
            id: user.id,
            email: user.email,
            role: user.role as 'user' | 'admin',
        })

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        })
    } catch (err) {
        next(err)
    }
})

authRouter.get('/me', requireAuth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user!.id).select(
            'name email role',
        )
        if (!user) return res.status(404).json({ error: 'User not found' })
        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        })
    } catch (err) {
        next(err)
    }
})