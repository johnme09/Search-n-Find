import { Link } from 'react-router-dom'

type Report = {
  id: number
  name: string
  type: 'Lost' | 'Found'
  category: string
  location: string
  date: string
  status: string
}

type Claim = {
  id: number
  name: string
  category: string
  location: string
  date: string
  status: string
}

const reports: Report[] = [
  {
    id: 1,
    name: 'Black Backpack',
    type: 'Lost',
    category: 'Other',
    location: 'Student Center',
    date: 'October 3, 2026',
    status: 'Lost',
  },
  {
    id: 3,
    name: 'Blue Water Bottle',
    type: 'Lost',
    category: 'Other',
    location: 'Engineering Building',
    date: 'October 1, 2026',
    status: 'Lost',
  },
]

const claims: Claim[] = [
  {
    id: 2,
    name: 'Apple AirPods',
    category: 'Electronics',
    location: 'Library',
    date: 'October 2, 2026',
    status: 'Claim Requested',
  },
]

function MyActivityPage() {
  return (
    <main className="activity-page">
      <div className="activity-header">
        <h1>My Activity</h1>
        <p>
          View your item reports and claims.
        </p>
      </div>

      <section className="activity-section">
        <div className="section-header">
          <h2>My Reports</h2>
          <Link to="/report" className="activity-action">
            Report an Item
          </Link>
        </div>

        {reports.length === 0 ? (
          <div className="empty-state">
            <h3>No Reports Yet</h3>
            <p>
              You have not submitted any lost or found item reports.
            </p>
          </div>
        ) : (
          <div className="activity-list">
            {reports.map((report) => (
              <article
                className="activity-card"
                key={report.id}
              >
                <div className="activity-card-header">
                  <div>
                    <h3>{report.name}</h3>
                    <p>{report.type} Item</p>
                  </div>

                  <span
                    className={`status ${report.status.toLowerCase()}`}
                  >
                    {report.status}
                  </span>
                </div>

                <div className="activity-info">
                  <span>
                    <strong>Category:</strong>{' '}
                    {report.category}
                  </span>

                  <span>
                    <strong>Location:</strong>{' '}
                    {report.location}
                  </span>

                  <span>
                    <strong>Date:</strong>{' '}
                    {report.date}
                  </span>
                </div>

                <Link
                  to={`/items/${report.id}`}
                  className="details-button"
                >
                  View Details
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="activity-section">
        <div className="section-header">
          <h2>My Claims</h2>
        </div>

        {claims.length === 0 ? (
          <div className="empty-state">
            <h3>No Claims Yet</h3>
            <p>
              You have not submitted any claims for found items.
            </p>
          </div>
        ) : (
          <div className="activity-list">
            {claims.map((claim) => (
              <article
                className="activity-card"
                key={claim.id}
              >
                <div className="activity-card-header">
                  <div>
                    <h3>{claim.name}</h3>
                    <p>Claimed Item</p>
                  </div>

                  <span className="claim-status">
                    {claim.status}
                  </span>
                </div>

                <div className="activity-info">
                  <span>
                    <strong>Category:</strong>{' '}
                    {claim.category}
                  </span>

                  <span>
                    <strong>Location:</strong>{' '}
                    {claim.location}
                  </span>

                  <span>
                    <strong>Date:</strong>{' '}
                    {claim.date}
                  </span>
                </div>

                <Link
                  to={`/items/${claim.id}`}
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

export default MyActivityPage