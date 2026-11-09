import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, getToken, type Item } from '../api'

function ItemDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [claimMode, setClaimMode] = useState(false)
  const [description, setDescription] = useState('')
  const [claimMessage, setClaimMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api<{ item: Item }>(`/items/${id}`)
      .then((res) => {
        setItem(res.item)
        setError(null)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const submitClaim = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api(`/items/${id}/claims`, {
        method: 'POST',
        body: JSON.stringify({ description }),
      })
      setClaimMessage('Claim submitted. An admin will review it.')
      setClaimMode(false)
    } catch (err) {
      setClaimMessage((err as Error).message)
    }
  }

  if (loading) return <main className="item-detail-page"><p>Loading…</p></main>

  if (error || !item) {
    return (
      <main className="item-detail-page">
        <div className="item-detail-card">
          <h1>Item Not Found</h1>

          <p>
            The item you're looking for does not exist.
          </p>

          <Link
            to="/search"
            className="back-button"
          >
            Back to Search
          </Link>
        </div>
      </main>
    )
  }

  const claimable =
    item.status === 'Found' &&
    item.lifecycle !== 'Returned' &&
    item.lifecycle !== 'Closed'

  return (
    <main className="item-detail-page">
      <div className="item-detail-card">
        <div className="item-detail-header">
          <div>
            <h1>{item.name}</h1>

            <p className="item-subtitle">
              Lost & Found Item
            </p>
          </div>

          <span
            className={`status ${item.status.toLowerCase()}`}
          >
            {item.status}
          </span>
        </div>

        <div className="item-detail-info">
          <div className="detail-row">
            <strong>Category</strong>
            <span>{item.category}</span>
          </div>

          <div className="detail-row">
            <strong>Location</strong>
            <span>{item.location}</span>
          </div>

          <div className="detail-row">
            <strong>Date Reported</strong>
            <span>{item.date}</span>
          </div>
        </div>

        <div className="item-description">
          <h2>Description</h2>
          <p>{item.description}</p>
        </div>

        {claimMessage && <p className="claim-message">{claimMessage}</p>}

        {claimMode ? (
          <form onSubmit={submitClaim} className="claim-form">
            <label htmlFor="claim-desc">
              Describe identifying details (proof of ownership)
            </label>
            <textarea
              id="claim-desc"
              rows={5}
              minLength={10}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="item-detail-actions">
              <button type="submit" className="claim-button">Submit Claim</button>
              <button type="button" className="back-button" onClick={() => setClaimMode(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="item-detail-actions">
            {claimable && getToken() && (
              <button type="button" className="claim-button" onClick={() => setClaimMode(true)}>
                Claim This Item
              </button>
            )}
            {claimable && !getToken() && (
              <Link to="/login" className="claim-button">Log in to Claim</Link>
            )}
            <Link to="/search" className="back-button">Back to Search</Link>
          </div>
        )}
      </div>
    </main>
  )
}

export default ItemDetailPage