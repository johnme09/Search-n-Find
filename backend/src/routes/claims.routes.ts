import { Router } from 'express'
import { z } from 'zod'
import { Types } from 'mongoose'
import { Item } from '../models/Item.js'
import { Claim } from '../models/Claim.js'
import { requireAuth } from '../middleware/auth.js'

export const claimsRouter = Router()

const claimSchema = z.object({
    description: z.string().min(10).max(2000),
})

claimsRouter.post('/items/:id/claims', requireAuth, async (req, res, next) => {
    try {
        if (!Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid item id' })
        }
        const { description } = claimSchema.parse(req.body)
        const itemId = new Types.ObjectId(req.params.id)
        const claimantId = new Types.ObjectId(req.user!.id)

        const item = await Item.findById(itemId)
        if (!item) return res.status(404).json({ error: 'Item not found' })
        if (item.status !== 'Found') {
            return res
                .status(400)
                .json({ error: 'Only found items can be claimed' })
        }
        if (['Returned', 'Closed'].includes(item.lifecycle)) {
            return res.status(400).json({ error: 'Item is no longer available' })
        }
        if (item.userId.equals(claimantId)) {
            return res
                .status(400)
                .json({ error: 'You cannot claim your own item' })
        }

        const existing = await Claim.findOne({
            itemId,
            claimantId,
            status: 'Pending',
        })
        if (existing) {
            return res
                .status(409)
                .json({ error: 'You already have a pending claim for this item' })
        }

        const claim = await Claim.create({ itemId, claimantId, description })
        item.lifecycle = 'Claim Requested'
        await item.save()

        res.status(201).json({
            claim: {
                id: claim._id.toString(),
                itemId: claim.itemId.toString(),
                status: claim.status,
                description: claim.description,
            },
        })
    } catch (err) {
        next(err)
    }
})