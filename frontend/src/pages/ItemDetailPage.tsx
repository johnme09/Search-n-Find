import { Link, useParams } from 'react-router-dom'

const items = [
  {
    id: 1,
    name: 'Black Backpack',
    category: 'Other',
    location: 'Student Center',
    status: 'Lost',
    date: 'October 3, 2026',
    description:
      'Black backpack reported missing from the Student Center.',
  },
  {
    id: 2,
    name: 'Apple AirPods',
    category: 'Electronics',
    location: 'Library',
    status: 'Found',
    date: 'October 2, 2026',
    description:
      'Apple AirPods found near the library study area.',
  },
  {
    id: 3,
    name: 'Blue Water Bottle',
    category: 'Other',
    location: 'Engineering Building',
    status: 'Lost',
    date: 'October 1, 2026',
    description:
      'Blue water bottle reported missing from the Engineering Building.',
  },
]

function ItemDetailPage() {
  const { id } = useParams()

  const item = items.find((item) => item.id === Number(id))

  if (!item) {
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

        <div className="item-detail-actions">
          {item.status === 'Found' && (
            <button
              type="button"
              className="claim-button"
            >
              Claim This Item
            </button>
          )}

          <Link
            to="/search"
            className="back-button"
          >
            Back to Search
          </Link>
        </div>
      </div>
    </main>
  )
}

export default ItemDetailPage