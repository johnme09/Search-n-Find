import type { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import mongoose from 'mongoose'

export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
) {
    if (err instanceof ZodError) {
        return res
            .status(400)
            .json({ error: 'Validation failed', details: err.issues })
    }
    if (err instanceof mongoose.Error.ValidationError) {
        return res
            .status(400)
            .json({ error: 'Validation failed', details: err.errors })
    }
    if ((err as { code?: number }).code === 11000) {
        return res.status(409).json({ error: 'Duplicate key' })
    }
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
}