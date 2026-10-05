import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
} from 'react-router-dom'

import SearchPage from './pages/SearchPage'
import ItemDetailPage from './pages/ItemDetailPage'

import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="navbar">
          <Link to="/search" className="logo">
            Search&Find
          </Link>

          <nav>
            <Link to="/search">Search</Link>
            <Link to="/search">Report Item</Link>
            <Link to="/search">My Activity</Link>

            <button>Login</button>
          </nav>
        </header>

        <Routes>
          <Route
            path="/"
            element={<Navigate to="/search" replace />}
          />

          <Route
            path="/search"
            element={<SearchPage />}
          />

          <Route
            path="/items/:id"
            element={<ItemDetailPage />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App