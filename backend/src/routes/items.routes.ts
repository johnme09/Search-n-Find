import { Router } from 'express'
import { z } from 'zod'
import { Types } from 'mongoose'
import { Item } from '../models/Item.js'
import { Claim } from '../models/Claim.js'
import { requireAuth } from '../middleware/auth.js'

export const itemsRouter = Router()

const reportSchema = z.object({
    name: z.string().min(1).max(200),
    category: z.string().min(1).max(100),
    location: z.string().min(1).max(200),
    status: z.enum(['Lost', 'Found']),
    date: z.string().min(1),
    description: z.string().min(1).max(2000),
})

const searchSchema = z.object({
    q: z.string().optional(),
    status: z.enum(['Lost', 'Found']).optional(),
    category: z.string().optional(),
    location: z.string().optional(),
})

function serializeItem(item: any) {
    return {
        id: item._id.toString(),
        name: item.name,
        category: item.category,
        location: item.location,
        status: item.status,
        lifecycle: item.lifecycle,
        date: item.date,
        description: item.description,
    }
}

// GET /api/items?q=&status=&category=&location=
itemsRouter.get('/', async (req, res, next) => {
    try {
        const { q, status, category, location } = searchSchema.parse(req.query)

        const filter: Record<string, unknown> = {}
        if (q) filter.name = { $regex: q, $options: 'i' }
        if (status) filter.status = status
        if (category) filter.category = { $regex: `^${category}$`, $options: 'i' }
        if (location) {
            filter.location = {
                $regex: location.replace(/-/g, ' '),
                $options: 'i',
            }
        }

        const items = await Item.find(filter).sort({ date: -1, _id: -1 })
        res.json({ items: items.map(serializeItem) })
    } catch (err) {
        next(err)
    }
})

// GET /api/items/mine/activity  (MUST come before /:id)
itemsRouter.get('/mine/activity', requireAuth, async (req, res, next) => {
    try {
        const userId = new Types.ObjectId(req.user!.id)

        const reports = await Item.find({ userId }).sort({ createdAt: -1 })
        const claims = await Claim.find({ claimantId: userId })
            .populate('itemId')
            .sort({ createdAt: -1 })

        res.json({
            reports: reports.map((r) => ({
                id: r._id.toString(),
                name: r.name,
                category: r.category,
                location: r.location,
                status: r.status,
                lifecycle: r.lifecycle,
                date: r.date,
            })),
            claims: claims.map((c) => {
                const item = c.itemId as any
                return {
                    id: c._id.toString(),
                    itemId: item?._id?.toString(),
                    name: item?.name,
                    category: item?.category,
                    location: item?.location,
                    status: item?.status,
                    date: item?.date,
                    claimStatus: c.status,
                }
            }),
        })
    } catch (err) {
        next(err)
    }
})

// GET /api/items/:id
itemsRouter.get('/:id', async (req, res, next) => {
    try {
        if (!Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid id' })
        }
        const item = await Item.findById(req.params.id)
        if (!item) return res.status(404).json({ error: 'Item not found' })
        res.json({
            item: { ...serializeItem(item), userId: item.userId.toString() },
        })
    } catch (err) {
        next(err)
    }
})

// POST /api/items
itemsRouter.post('/', requireAuth, async (req, res, next) => {
    try {
        const body = reportSchema.parse(req.body)
        const item = await Item.create({
            ...body,
            userId: new Types.ObjectId(req.user!.id),
            lifecycle: 'Active',
        })
        res.status(201).json({ item: serializeItem(item) })
    } catch (err) {
        next(err)
    }
})