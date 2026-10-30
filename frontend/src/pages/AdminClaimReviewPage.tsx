import { useState } from 'react'

type ClaimStatus = 'Pending' | 'Approved' | 'Denied'

type Claim = {
  id: number
  itemId: number
  itemName: string
  claimant: string
  date: string
  description: string
  status: ClaimStatus
  itemStatus: string
}

type HistoryEntry = {
  claimant: string
  status: ClaimStatus
  decisionDate: string
  note: string
}

const initialClaims: Claim[] = [
  {
    id: 1,
    itemId: 1,
    itemName: 'Black Backpack',
    claimant: 'user1@university.edu',
    date: 'October 25, 2026 10:14 AM',
    description:
      'Black backpack with a laptop compartment and a small campus sticker on the front.',
    status: 'Pending',
    itemStatus: 'Claim Requested',
  },
  {
    id: 2,
    itemId: 2,
    itemName: 'Student ID Card',
    claimant: 'user2@university.edu',
    date: 'October 24, 2026 2:30 PM',
    description:
      'Claimant provided identifying information for the student ID card.',
    status: 'Pending',
    itemStatus: 'Claim Requested',
  },
]

const initialHistory: Record<number, HistoryEntry[]> = {
  1: [],
  2: [],
}

function AdminClaimReviewPage() {
  const [claims, setClaims] = useState(initialClaims)
  const [history, setHistory] = useState(initialHistory)
  const [expandedHistoryId, setExpandedHistoryId] =
    useState<number | null>(null)

  const addHistoryEntry = (
    claim: Claim,
    status: ClaimStatus,
    note: string,
  ) => {
    setHistory((currentHistory) => ({
      ...currentHistory,
      [claim.itemId]: [
        ...(currentHistory[claim.itemId] || []),
        {
          claimant: claim.claimant,
          status,
          decisionDate: new Date().toLocaleString(),
          note,
        },
      ],
    }))
  }

  const updateClaim = (
    id: number,
    action: 'approve' | 'deny',
  ) => {
    const claim = claims.find((current) => current.id === id)

    if (!claim || claim.status !== 'Pending') {
      return
    }

    const nextStatus: ClaimStatus =
      action === 'approve'
        ? 'Approved'
        : 'Denied'

    const nextItemStatus =
      action === 'approve'
        ? 'Claim Approved'
        : 'Found'

    addHistoryEntry(
      claim,
      nextStatus,
      action === 'approve'
        ? 'Claim approved by Administrator.'
        : 'Claim denied by Administrator.',
    )

    setClaims((currentClaims) =>
      currentClaims.map((currentClaim) =>
        currentClaim.id === id
          ? {
              ...currentClaim,
              status: nextStatus,
              itemStatus: nextItemStatus,
            }
          : currentClaim,
      ),
    )
  }

  const markReturned = (id: number) => {
    const claim = claims.find((current) => current.id === id)

    if (
      !claim ||
      claim.status !== 'Approved' ||
      claim.itemStatus !== 'Claim Approved'
    ) {
      return
    }

    addHistoryEntry(
      claim,
      'Approved',
      'Item marked as returned by Administrator.',
    )

    setClaims((currentClaims) =>
      currentClaims.map((currentClaim) =>
        currentClaim.id === id
          ? {
              ...currentClaim,
              itemStatus: 'Returned',
            }
          : currentClaim,
      ),
    )
  }

  const closeListing = (id: number) => {
    const claim = claims.find((current) => current.id === id)

    if (
      !claim ||
      claim.itemStatus === 'Returned' ||
      claim.itemStatus === 'Closed'
    ) {
      return
    }

    addHistoryEntry(
      claim,
      claim.status,
      'Listing closed by Administrator.',
    )

    setClaims((currentClaims) =>
      currentClaims.map((currentClaim) =>
        currentClaim.id === id
          ? {
              ...currentClaim,
              itemStatus: 'Closed',
            }
          : currentClaim,
      ),
    )
  }

  const toggleHistory = (itemId: number) => {
    setExpandedHistoryId((currentId) =>
      currentId === itemId ? null : itemId,
    )
  }

  const pendingClaims = claims.filter(
    (claim) => claim.status === 'Pending',
  )

  const decidedClaims = claims.filter(
    (claim) => claim.status !== 'Pending',
  )

  return (
    <main className="admin-page">
      <div className="admin-header">
        <h1>Claim Review</h1>

        <p>
          Review pending claims and manage item status.
        </p>
      </div>

      <section className="admin-section">
        <div className="section-header">
          <h2>
            Pending Claims ({pendingClaims.length})
          </h2>
        </div>

        {pendingClaims.length === 0 ? (
          <div className="empty-state">
            <h3>No Pending Claims</h3>

            <p>
              There are no claims currently waiting for review.
            </p>
          </div>
        ) : (
          <div className="admin-list">
            {pendingClaims.map((claim) => (
              <article
                className="admin-claim-card"
                key={claim.id}
              >
                <div className="admin-claim-header">
                  <div>
                    <h3>{claim.itemName}</h3>
                    <p>{claim.claimant}</p>
                  </div>

                  <span className="claim-status pending">
                    Pending
                  </span>
                </div>

                <div className="admin-claim-info">
                  <p>
                    <strong>Claim Date:</strong>{' '}
                    {claim.date}
                  </p>

                  <p>
                    <strong>Item Status:</strong>{' '}
                    {claim.itemStatus}
                  </p>
                </div>

                <div className="admin-claim-details">
                  <h4>Supporting Description</h4>

                  <p>{claim.description}</p>
                </div>

                <div className="admin-actions">
                  <button
                    type="button"
                    className="approve-button"
                    onClick={() =>
                      updateClaim(
                        claim.id,
                        'approve',
                      )
                    }
                  >
                    Approve
                  </button>

                  <button
                    type="button"
                    className="deny-button"
                    onClick={() =>
                      updateClaim(
                        claim.id,
                        'deny',
                      )
                    }
                  >
                    Deny
                  </button>

                  <button
                    type="button"
                    className="admin-secondary-button"
                    onClick={() =>
                      toggleHistory(claim.itemId)
                    }
                  >
                    {expandedHistoryId === claim.itemId
                      ? 'Hide History'
                      : 'View Claim History'}
                  </button>
                </div>

                {expandedHistoryId === claim.itemId && (
                  <div className="claim-history">
                    <h4>Claim History</h4>

                    <p>
                      No previous claim decisions for this
                      listing.
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {decidedClaims.length > 0 && (
        <section className="admin-section">
          <div className="section-header">
            <h2>Recent Decisions</h2>
          </div>

          <div className="admin-list">
            {decidedClaims.map((claim) => (
              <article
                className="admin-claim-card"
                key={claim.id}
              >
                <div className="admin-claim-header">
                  <div>
                    <h3>{claim.itemName}</h3>
                    <p>{claim.claimant}</p>
                  </div>

                  <span
                    className={`claim-status ${claim.status.toLowerCase()}`}
                  >
                    {claim.status}
                  </span>
                </div>

                <div className="admin-claim-info">
                  <p>
                    <strong>Claim Date:</strong>{' '}
                    {claim.date}
                  </p>

                  <p>
                    <strong>Item Status:</strong>{' '}
                    {claim.itemStatus}
                  </p>
                </div>

                <div className="admin-claim-details">
                  <h4>Supporting Description</h4>

                  <p>{claim.description}</p>
                </div>

                <div className="admin-actions">
                  {claim.status === 'Approved' &&
                    claim.itemStatus === 'Claim Approved' && (
                      <button
                        type="button"
                        className="approve-button"
                        onClick={() =>
                          markReturned(claim.id)
                        }
                      >
                        Mark Returned
                      </button>
                    )}

                  {claim.itemStatus !== 'Returned' &&
                    claim.itemStatus !== 'Closed' && (
                      <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={() =>
                          closeListing(claim.id)
                        }
                      >
                        Close
                      </button>
                    )}

                  <button
                    type="button"
                    className="admin-secondary-button"
                    onClick={() =>
                      toggleHistory(claim.itemId)
                    }
                  >
                    {expandedHistoryId === claim.itemId
                      ? 'Hide History'
                      : 'View Claim History'}
                  </button>
                </div>

                {expandedHistoryId === claim.itemId && (
                  <div className="claim-history">
                    <h4>Claim History</h4>

                    {history[claim.itemId]?.length === 0 ? (
                      <p>
                        No claim history is available.
                      </p>
                    ) : (
                      history[claim.itemId].map(
                        (entry, index) => (
                          <div
                            className="history-entry"
                            key={`${claim.id}-${index}`}
                          >
                            <p>
                              <strong>
                                {entry.status}
                              </strong>{' '}
                              — {entry.claimant}
                            </p>

                            <p>
                              {entry.decisionDate}
                            </p>

                            <p>{entry.note}</p>
                          </div>
                        ),
                      )
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