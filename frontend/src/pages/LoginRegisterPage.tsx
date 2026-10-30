import { useState } from 'react'
import { Link } from 'react-router-dom'

function LoginRegisterPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode)
    setSubmitted(false)
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Search&Find</h1>

          <p>
            {mode === 'login'
              ? 'Log in to manage your lost and found activity.'
              : 'Create your Search&Find account.'}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={
              mode === 'login'
                ? 'auth-tab active'
                : 'auth-tab'
            }
            onClick={() => switchMode('login')}
          >
            Log In
          </button>

          <button
            type="button"
            className={
              mode === 'register'
                ? 'auth-tab active'
                : 'auth-tab'
            }
            onClick={() => switchMode('register')}
          >
            Register
          </button>
        </div>

        {submitted ? (
          <div className="auth-success">
            <h2>
              {mode === 'login'
                ? 'Login Successful'
                : 'Registration Successful'}
            </h2>

            <p>
              This is currently a frontend demo.
              Authentication will be connected to the
              backend later.
            </p>

            <Link
              to="/search"
              className="submit-button"
            >
              Continue to Search
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="name">
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">
                University Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="name@university.edu"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                minLength={8}
                required
              />
            </div>

            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="confirm-password">
                  Confirm Password
                </label>

                <input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  minLength={8}
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="submit-button auth-submit"
            >
              {mode === 'login'
                ? 'Log In'
                : 'Create Account'}
            </button>
          </form>
        )}

        {!submitted && (
          <Link
            to="/search"
            className="auth-back-link"
          >
            Continue as visitor
          </Link>
        )}
      </div>
    </main>
  )
}

export default LoginRegisterPage