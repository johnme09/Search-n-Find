import { Router } from 'express'
import { z } from 'zod'
import { Types } from 'mongoose'
import { Item } from '../models/Item.js'
import { Claim } from '../models/Claim.js'
import { ClaimHistory } from '../models/ClaimHistory.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

export const adminRouter = Router()
adminRouter.use(requireAuth, requireAdmin)

async function loadClaimWithItem(id: string) {
    if (!Types.ObjectId.isValid(id)) return null
    const claim = await Claim.findById(id)
        .populate('itemId')
        .populate('claimantId', 'email')
    if (!claim) return null
    return claim as any
}

async function logHistory(
    itemId: Types.ObjectId,
    claimantEmail: string,
    status: string,
    note: string,
) {
    await ClaimHistory.create({ itemId, claimantEmail, status, note })
}

// GET /api/admin/claims
adminRouter.get('/claims', async (_req, res, next) => {
    try {
        const claims = await Claim.find()
            .populate('itemId')
            .populate('claimantId', 'email')
            .sort({ status: 1, createdAt: -1 })

        res.json({
            claims: claims.map((c: any) => ({
                id: c._id.toString(),
                itemId: c.itemId?._id?.toString(),
                itemName: c.itemId?.name,
                itemStatusType: c.itemId?.status,
                lifecycle: c.itemId?.lifecycle,
                claimant: c.claimantId?.email,
                description: c.description,
                status: c.status,
                date: c.createdAt.toISOString(),
                decidedAt: c.decidedAt?.toISOString() ?? null,
            })),
        })
    } catch (err) {
        next(err)
    }
})

const decisionSchema = z.object({ action: z.enum(['approve', 'deny']) })

// POST /api/admin/claims/:id/decision
adminRouter.post('/claims/:id/decision', async (req, res, next) => {
    try {
        const { action } = decisionSchema.parse(req.body)
        const claim = await loadClaimWithItem(req.params.id)
        if (!claim) return res.status(404).json({ error: 'Claim not found' })
        if (claim.status !== 'Pending') {
            return res.status(400).json({ error: 'Claim already decided' })
        }

        const nextStatus = action === 'approve' ? 'Approved' : 'Denied'
        const nextLifecycle =
            action === 'approve' ? 'Claim Approved' : 'Active'

        claim.status = nextStatus
        claim.decidedAt = new Date()
        await claim.save()

        const item = await Item.findById(claim.itemId._id)
        if (item) {
            item.lifecycle = nextLifecycle
            await item.save()
        }

        await logHistory(
            claim.itemId._id,
            claim.claimantId.email,
            nextStatus,
            `Claim ${nextStatus.toLowerCase()} by Administrator.`,
        )

        res.json({ ok: true, status: nextStatus, lifecycle: nextLifecycle })
    } catch (err) {
        next(err)
    }
})

// POST /api/admin/claims/:id/return
adminRouter.post('/claims/:id/return', async (req, res, next) => {
    try {
        const claim = await loadClaimWithItem(req.params.id)
        if (!claim) return res.status(404).json({ error: 'Claim not found' })
        if (
            claim.status !== 'Approved' ||
            claim.itemId.lifecycle !== 'Claim Approved'
        ) {
            return res
                .status(400)
                .json({ error: 'Claim is not in a returnable state' })
        }

        const item = await Item.findById(claim.itemId._id)
        if (!item) return res.status(404).json({ error: 'Item not found' })
        item.lifecycle = 'Returned'
        await item.save()

        await logHistory(
            claim.itemId._id,
            claim.claimantId.email,
            'Approved',
            'Item marked as returned by Administrator.',
        )

        res.json({ ok: true, lifecycle: 'Returned' })
    } catch (err) {
        next(err)
    }
})

// POST /api/admin/claims/:id/close
adminRouter.post('/claims/:id/close', async (req, res, next) => {
    try {
        const claim = await loadClaimWithItem(req.params.id)
        if (!claim) return res.status(404).json({ error: 'Claim not found' })
        if (['Returned', 'Closed'].includes(claim.itemId.lifecycle)) {
            return res.status(400).json({ error: 'Listing already closed' })
        }

        const item = await Item.findById(claim.itemId._id)
        if (!item) return res.status(404).json({ error: 'Item not found' })
        item.lifecycle = 'Closed'
        await item.save()

        await logHistory(
            claim.itemId._id,
            claim.claimantId.email,
            claim.status,
            'Listing closed by Administrator.',
        )

        res.json({ ok: true, lifecycle: 'Closed' })
    } catch (err) {
        next(err)
    }
})

// GET /api/admin/items/:itemId/history
adminRouter.get('/items/:itemId/history', async (req, res, next) => {
    try {
        if (!Types.ObjectId.isValid(req.params.itemId)) {
            return res.status(400).json({ error: 'Invalid item id' })
        }
        const rows = await ClaimHistory.find({
            itemId: new Types.ObjectId(req.params.itemId),
        }).sort({ decisionDate: 1 })

        res.json({
            history: rows.map((r) => ({
                id: r._id.toString(),
                claimant: r.claimantEmail,
                status: r.status,
                decisionDate: r.decisionDate.toISOString(),
                note: r.note,
            })),
        })
    } catch (err) {
        next(err)
    }
})