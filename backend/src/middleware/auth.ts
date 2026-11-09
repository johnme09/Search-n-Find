import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export type Role = 'user' | 'admin'

export interface AuthPayload {
    id: string
    email: string
    role: Role
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload
        }
    }
}

const secret = process.env.JWT_SECRET!

export function signToken(payload: AuthPayload) {
    return jwt.sign(payload, secret, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    })
}

export function requireAuth(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing token' })
    }
    try {
        req.user = jwt.verify(header.slice(7), secret) as AuthPayload
        next()
    } catch {
        return res.status(401).json({ error: 'Invalid or expired token' })
    }
}

export function requireAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' })
    }
    next()
}