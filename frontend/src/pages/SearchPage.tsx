import { useState } from 'react'
import { Link } from 'react-router-dom'

type Item = {
  id: number
  name: string
  category: string
  location: string
  status: 'Lost' | 'Found'
  date: string
}

const items: Item[] = [
  {
    id: 1,
    name: 'Black Backpack',
    category: 'Other',
    location: 'Student Center',
    status: 'Lost',
    date: 'October 3, 2026',
  },
  {
    id: 2,
    name: 'Apple AirPods',
    category: 'Electronics',
    location: 'Library',
    status: 'Found',
    date: 'October 2, 2026',
  },
  {
    id: 3,
    name: 'Blue Water Bottle',
    category: 'Other',
    location: 'Engineering Building',
    status: 'Lost',
    date: 'October 1, 2026',
  },
]

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === '' ||
      item.status.toLowerCase() === statusFilter

    const matchesCategory =
      categoryFilter === '' ||
      item.category.toLowerCase() === categoryFilter

    const matchesLocation =
      locationFilter === '' ||
      item.location.toLowerCase().replace(' ', '-') === locationFilter

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCategory &&
      matchesLocation
    )
  })

  return (
    <main className="search-page">
      <h1>Search Lost & Found Items</h1>

      <div className="search-controls">
        <input
          type="text"
          placeholder="Search by item name..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="documents">Documents</option>
          <option value="other">Other</option>
        </select>

        <select
          value={locationFilter}
          onChange={(event) => setLocationFilter(event.target.value)}
        >
          <option value="">All Locations</option>
          <option value="library">Library</option>
          <option value="student-center">Student Center</option>
          <option value="engineering">Engineering Building</option>
        </select>

        <button type="button">Search</button>
      </div>

      <section className="results">
        <h2>Items</h2>

        {filteredItems.length === 0 ? (
          <p>No items found.</p>
        ) : (
          <div className="item-grid">
            {filteredItems.map((item) => (
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