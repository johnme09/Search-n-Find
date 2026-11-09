import { useEffect, useState } from 'react'
import { api, type AdminClaim, type HistoryEntry } from '../api'

function AdminClaimReviewPage() {
  const [claims, setClaims] = useState<AdminClaim[]>([])
  const [history, setHistory] = useState<Record<string, HistoryEntry[]>>({})
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = () => {
    setLoading(true)
    api<{ claims: AdminClaim[] }>('/admin/claims')
      .then((res) => {
        setClaims(res.claims)
        setError(null)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(reload, [])

  const decide = async (id: string, action: 'approve' | 'deny') => {
    try {
      await api(`/admin/claims/${id}/decision`, {
        method: 'POST',
        body: JSON.stringify({ action }),
      })
      reload()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const markReturned = async (id: string) => {
    try {
      await api(`/admin/claims/${id}/return`, { method: 'POST' })
      reload()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const closeListing = async (id: string) => {
    try {
      await api(`/admin/claims/${id}/close`, { method: 'POST' })
      reload()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const toggleHistory = async (itemId: string) => {
    if (expandedId === itemId) {
      setExpandedId(null)
      return
    }
    setExpandedId(itemId)
    if (!history[itemId]) {
      try {
        const res = await api<{ history: HistoryEntry[] }>(
          `/admin/items/${itemId}/history`,
        )
        setHistory((h) => ({ ...h, [itemId]: res.history }))
      } catch (err) {
        setError((err as Error).message)
      }
    }
  }

  const pendingClaims = claims.filter((c) => c.status === 'Pending')
  const decidedClaims = claims.filter((c) => c.status !== 'Pending')

  if (loading) return <main className="admin-page"><p>Loading…</p></main>

  if (error && claims.length === 0) {
    return (
      <main className="admin-page">
        <h1>Claim Review</h1>
        <p>Error: {error}</p>
      </main>
    )
  }

  return (
    <main className="admin-page">
      <div className="admin-header">
        <h1>Claim Review</h1>
        <p>Review pending claims and manage item status.</p>
      </div>

      {error && <p className="auth-error">{error}</p>}

      <section className="admin-section">
        <div className="section-header">
          <h2>Pending Claims ({pendingClaims.length})</h2>
        </div>
        {pendingClaims.length === 0 ? (
          <div className="empty-state">
            <h3>No Pending Claims</h3>
            <p>There are no claims currently waiting for review.</p>
          </div>
        ) : (
          <div className="admin-list">
            {pendingClaims.map((claim) => (
              <article className="admin-claim-card" key={claim.id}>
                <div className="admin-claim-header">
                  <div>
                    <h3>{claim.itemName}</h3>
                    <p>{claim.claimant}</p>
                  </div>
                  <span className="claim-status pending">Pending</span>
                </div>
                <div className="admin-claim-info">
                  <p><strong>Claim Date:</strong> {new Date(claim.date).toLocaleString()}</p>
                  <p><strong>Item Status:</strong> {claim.lifecycle}</p>
                </div>
                <div className="admin-claim-details">
                  <h4>Supporting Description</h4>
                  <p>{claim.description}</p>
                </div>
                <div className="admin-actions">
                  <button type="button" className="approve-button" onClick={() => decide(claim.id, 'approve')}>
                    Approve
                  </button>
                  <button type="button" className="deny-button" onClick={() => decide(claim.id, 'deny')}>
                    Deny
                  </button>
                  <button type="button" className="admin-secondary-button" onClick={() => toggleHistory(claim.itemId)}>
                    {expandedId === claim.itemId ? 'Hide History' : 'View Claim History'}
                  </button>
                </div>
                {expandedId === claim.itemId && (
                  <div className="claim-history">
                    <h4>Claim History</h4>
                    {!history[claim.itemId] || history[claim.itemId].length === 0 ? (
                      <p>No previous claim decisions for this listing.</p>
                    ) : (
                      history[claim.itemId].map((entry) => (
                        <div className="history-entry" key={entry.id}>
                          <p><strong>{entry.status}</strong> — {entry.claimant}</p>
                          <p>{new Date(entry.decisionDate).toLocaleString()}</p>
                          <p>{entry.note}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {decidedClaims.length > 0 && (
        <section className="admin-section">
          <div className="section-header"><h2>Recent Decisions</h2></div>
          <div className="admin-list">
            {decidedClaims.map((claim) => (
              <article className="admin-claim-card" key={claim.id}>
                <div className="admin-claim-header">
                  <div>
                    <h3>{claim.itemName}</h3>
                    <p>{claim.claimant}</p>
                  </div>
                  <span className={`claim-status ${claim.status.toLowerCase()}`}>{claim.status}</span>
                </div>
                <div className="admin-claim-info">
                  <p><strong>Claim Date:</strong> {new Date(claim.date).toLocaleString()}</p>
                  <p><strong>Item Status:</strong> {claim.lifecycle}</p>
                </div>
                <div className="admin-claim-details">
                  <h4>Supporting Description</h4>
                  <p>{claim.description}</p>
                </div>
                <div className="admin-actions">
                  {claim.status === 'Approved' && claim.lifecycle === 'Claim Approved' && (
                    <button type="button" className="approve-button" onClick={() => markReturned(claim.id)}>
                      Mark Returned
                    </button>
                  )}
                  {claim.lifecycle !== 'Returned' && claim.lifecycle !== 'Closed' && (
                    <button type="button" className="admin-secondary-button" onClick={() => closeListing(claim.id)}>
                      Close
                    </button>
                  )}
                  <button type="button" className="admin-secondary-button" onClick={() => toggleHistory(claim.itemId)}>
                    {expandedId === claim.itemId ? 'Hide History' : 'View Claim History'}
                  </button>
                </div>
                {expandedId === claim.itemId && (
                  <div className="claim-history">
                    <h4>Claim History</h4>
                    {!history[claim.itemId] || history[claim.itemId].length === 0 ? (
                      <p>No claim history is available.</p>
                    ) : (
                      history[claim.itemId].map((entry) => (
                        <div className="history-entry" key={entry.id}>
                          <p><strong>{entry.status}</strong> — {entry.claimant}</p>
                          <p>{new Date(entry.decisionDate).toLocaleString()}</p>
                          <p>{entry.note}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

export default AdminClaimReviewPage