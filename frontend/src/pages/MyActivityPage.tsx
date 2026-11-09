import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  api,
  getToken,
  type ReportActivity,
  type ClaimActivity,
} from '../api'

function MyActivityPage() {
  const [reports, setReports] = useState<ReportActivity[]>([])
  const [claims, setClaims] = useState<ClaimActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!getToken()) {
      setLoading(false)
      return
    }
    api<{ reports: ReportActivity[]; claims: ClaimActivity[] }>(
      '/items/mine/activity',
    )
      .then((res) => {
        setReports(res.reports)
        setClaims(res.claims)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (!getToken()) {
    return (
      <main className="activity-page">
        <div className="activity-header">
          <h1>My Activity</h1>
          <p>Please log in to view your activity.</p>
        </div>
        <Link to="/login" className="submit-button">Log In</Link>
      </main>
    )
  }

  return (
    <main className="activity-page">
      <div className="activity-header">
        <h1>My Activity</h1>
        <p>View your item reports and claims.</p>
      </div>

      {loading && <p>Loading…</p>}
      {error && <p>Error: {error}</p>}

      {!loading && !error && (
        <>
          <section className="activity-section">
            <div className="section-header">
              <h2>My Reports</h2>
              <Link to="/report" className="activity-action">Report an Item</Link>
            </div>
            {reports.length === 0 ? (
              <div className="empty-state">
                <h3>No Reports Yet</h3>
                <p>You have not submitted any lost or found item reports.</p>
              </div>
            ) : (
              <div className="activity-list">
                {reports.map((report) => (
                  <article className="activity-card" key={report.id}>
                    <div className="activity-card-header">
                      <div>
                        <h3>{report.name}</h3>
                        <p>{report.status} Item</p>
                      </div>
                      <span className={`status ${report.status.toLowerCase()}`}>
                        {report.lifecycle}
                      </span>
                    </div>
                    <div className="activity-info">
                      <span><strong>Category:</strong> {report.category}</span>
                      <span><strong>Location:</strong> {report.location}</span>
                      <span><strong>Date:</strong> {report.date}</span>
                    </div>
                    <Link to={`/items/${report.id}`} className="details-button">
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
                <p>You have not submitted any claims for found items.</p>
              </div>
            ) : (
              <div className="activity-list">
                {claims.map((claim) => (
                  <article className="activity-card" key={claim.id}>
                    <div className="activity-card-header">
                      <div>
                        <h3>{claim.name}</h3>
                        <p>Claimed Item</p>
                      </div>
                      <span className="claim-status">{claim.claimStatus}</span>
                    </div>
                    <div className="activity-info">
                      <span><strong>Category:</strong> {claim.category}</span>
                      <span><strong>Location:</strong> {claim.location}</span>
                      <span><strong>Date:</strong> {claim.date}</span>
                    </div>
                    <Link to={`/items/${claim.itemId}`} className="details-button">
                      View Details
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  )
}

export default MyActivityPage