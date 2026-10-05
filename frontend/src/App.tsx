import './App.css'

function App() {
  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">
          Search&Find
        </div>

        <nav>
          <a href="#">Search</a>
          <a href="#">Report Item</a>
          <a href="#">My Activity</a>
          <button>Login</button>
        </nav>
      </header>

      <main className="hero-section">
        <h1>Find what you've lost.</h1>

        <p>
          Search for lost and found items on campus,
          or report an item you've found.
        </p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search for an item..."
          />

          <button>Search</button>
        </div>

        <div className="actions">
          <button>Report Lost Item</button>
          <button>Report Found Item</button>
        </div>
      </main>
    </div>
  )
}

export default App