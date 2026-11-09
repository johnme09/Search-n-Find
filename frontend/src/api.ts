const BASE = 'http://localhost:4000/api'

export function getToken() {
    return localStorage.getItem('token')
}

export function setToken(token: string | null) {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
}

export async function api<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const token = getToken()
    const res = await fetch(`${BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
        throw new Error(
            (data as { error?: string }).error ?? `HTTP ${res.status}`,
        )
    }
    return data as T
}

export type Item = {
    id: string
    name: string
    category: string
    location: string
    status: 'Lost' | 'Found'
    lifecycle: 'Active' | 'Claim Requested' | 'Claim Approved' | 'Returned' | 'Closed'
    date: string
    description?: string
}

export type ReportActivity = {
    id: string
    name: string
    category: string
    location: string
    status: 'Lost' | 'Found'
    lifecycle: string
    date: string
}

export type ClaimActivity = {
    id: string
    itemId: string
    name: string
    category: string
    location: string
    status: 'Lost' | 'Found'
    date: string
    claimStatus: 'Pending' | 'Approved' | 'Denied'
}

export type AdminClaim = {
    id: string
    itemId: string
    itemName: string
    itemStatusType: 'Lost' | 'Found'
    lifecycle: string
    claimant: string
    description: string
    status: 'Pending' | 'Approved' | 'Denied'
    date: string
    decidedAt: string | null
}

export type HistoryEntry = {
    id: string
    claimant: string
    status: string
    decisionDate: string
    note: string
}

export type AuthUser = {
    id: string
    name: string
    email: string
    role: 'user' | 'admin'
}