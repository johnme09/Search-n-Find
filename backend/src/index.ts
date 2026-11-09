import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDb } from './db.js'
import { authRouter } from './routes/auth.routes.js'
import { itemsRouter } from './routes/items.routes.js'
import { claimsRouter } from './routes/claims.routes.js'
import { adminRouter } from './routes/admin.routes.js'
import { errorHandler } from './middleware/error.js'

const app = express()

app.use(
    cors({
        origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5173',
    }),
)
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.use('/api/auth', authRouter)
app.use('/api', claimsRouter)
app.use('/api/items', itemsRouter)
app.use('/api/admin', adminRouter)

app.use((_req, res) => res.status(404).json({ error: 'Not found' }))
app.use(errorHandler)

const port = Number(process.env.PORT || 4000)

connectDb()
    .then(() => {
        app.listen(port, () => {
            console.log(`API listening on http://localhost:${port}`)
        })
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err)
        process.exit(1)
    })