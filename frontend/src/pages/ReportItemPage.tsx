import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, getToken, type Item } from '../api'

function ReportItemPage() {
  const [itemType, setItemType] = useState<'Lost' | 'Found'>('Lost')
  const [itemName, setItemName] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [created, setCreated] = useState<Item | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const res = await api<{ item: Item }>('/items', {
        method: 'POST',
        body: JSON.stringify({
          name: itemName,
          category,
          location,
          status: itemType,
          date,
          description,
        }),
      })
      setCreated(res.item)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!getToken()) {
    return (
      <main className="report-page">
        <div className="report-card">
          <h1>Login Required</h1>
          <p>You need to be logged in to report an item.</p>
          <Link to="/login" className="submit-button">Log In</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="report-page">
      <div className="report-card">
        <div className="report-header">
          <h1>Report an Item</h1>
          <p>Report a lost or found item on campus.</p>
        </div>

        {error && <p className="auth-error">{error}</p>}

        {created ? (
          <div className="success-message">
            <h2>Report Submitted</h2>
            <p>Your {itemType.toLowerCase()} item report has been submitted successfully.</p>
            <div className="form-actions">
              <button
                type="button"
                className="back-button"
                onClick={() => navigate(`/items/${created.id}`)}
              >
                View Item
              </button>
              <Link to="/search" className="back-button">Back to Search</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Report Type</label>
              <div className="report-type-options">
                <button
                  type="button"
                  className={itemType === 'Lost' ? 'type-button active' : 'type-button'}
                  onClick={() => setItemType('Lost')}
                >
                  I Lost an Item
                </button>
                <button
                  type="button"
                  className={itemType === 'Found' ? 'type-button active' : 'type-button'}
                  onClick={() => setItemType('Found')}
                >
                  I Found an Item
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="item-name">Item Name</label>
              <input
                id="item-name"
                type="text"
                placeholder="e.g. Black Backpack"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select a category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Documents">Documents</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <select
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              >
                <option value="">Select a location</option>
                <option value="Library">Library</option>
                <option value="Student Center">Student Center</option>
                <option value="Engineering Building">Engineering Building</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                placeholder="Describe the item and any identifying details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
              />
            </div>

            <div className="form-actions">
              <Link to="/search" className="back-button">Cancel</Link>
              <button type="submit" className="submit-button" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}

export default ReportItemPage