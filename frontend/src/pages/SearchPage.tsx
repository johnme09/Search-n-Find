import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type Item } from '../api'

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams()
    if (searchTerm) params.set('q', searchTerm)
    if (statusFilter) params.set('status', statusFilter === 'lost' ? 'Lost' : 'Found')
    if (categoryFilter) params.set('category', categoryFilter)
    if (locationFilter) params.set('location', locationFilter)

    const timer = setTimeout(() => {
      setLoading(true)
      api<{ items: Item[] }>(`/items?${params.toString()}`)
        .then((res) => {
          setItems(res.items)
          setError(null)
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false))
    }, 250)

    return () => clearTimeout(timer)
  }, [searchTerm, statusFilter, categoryFilter, locationFilter])

  return (
    <main className="search-page">
      <h1>Search Lost & Found Items</h1>

      <div className="search-controls">
        <input
          type="text"
          placeholder="Search by item name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="documents">Documents</option>
          <option value="other">Other</option>
        </select>
        <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
          <option value="">All Locations</option>
          <option value="library">Library</option>
          <option value="student-center">Student Center</option>
          <option value="engineering">Engineering Building</option>
        </select>

        <button type="button">Search</button>
      </div>

      <section className="results">
        <h2>Items</h2>
        {loading && <p>Loading…</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && items.length === 0 && <p>No items found.</p>}
        {!loading && items.length > 0 && (
          <div className="item-grid">
            {items.map((item) => (
              <article className="item-card" key={item.id}>
                <div className="item-card-header">
                  <h3>{item.name}</h3>

                  <span
                    className={`status ${item.status.toLowerCase()}`}
                  >
                    {item.status}
                  </span>
                </div>

                <p>
                  <strong>Category:</strong> {item.category}
                </p>

                <p>
                  <strong>Location:</strong> {item.location}
                </p>

                <p>
                  <strong>Date:</strong> {item.date}
                </p>

                <Link
                  to={`/items/${item.id}`}
                  className="details-button"
                >
                  View Details
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default SearchPage