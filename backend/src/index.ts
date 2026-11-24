import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { connectDb } from './db.js'
import { authRouter } from './routes/auth.routes.js'
import { itemsRouter } from './routes/items.routes.js'
import { claimsRouter } from './routes/claims.routes.js'
import { adminRouter } from './routes/admin.routes.js'
import { errorHandler } from './middleware/error.js'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

app.use(
    cors({
        origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5173' || 'http://localhost:4000',
        credentials: true,
    }),
)
app.use(express.json())

const staticPath = path.join(__dirname, 'dist')

app.use('/assets', express.static(path.join(staticPath, 'assets')))
app.use(express.static(staticPath))

// SPA fallback - ONLY for non-asset, non-API routes
app.get(/^\/(.*)$/, (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
        return next()
    }

    // Skip asset files (already handled by static middleware)
    if (req.path.startsWith('/assets/')) {
        return next()
    }

    // Skip other static file extensions
    const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.json', '.txt']
    if (staticExtensions.some(ext => req.path.endsWith(ext))) {
        return next()
    }

    // Only serve index.html for actual page routes
    res.sendFile(path.join(staticPath, 'index.html'), (err) => {
        if (err) {
            console.error('Error sending index.html:', err)
            next(err)
        }
    })
})

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