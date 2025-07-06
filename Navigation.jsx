import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function Navigation({ onLogout, user }) {
  const location = useLocation()

  return (
    <nav className="nav">
      <div className="nav-brand">
        🥗 Diet Planner
      </div>
      <ul className="nav-links">
        <li>
          <Link 
            to="/dashboard" 
            className={location.pathname === '/dashboard' ? 'active' : ''}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link 
            to="/meal-planner" 
            className={location.pathname === '/meal-planner' ? 'active' : ''}
          >
            Meal Planner
          </Link>
        </li>
        <li>
          <Link 
            to="/nutrition-tracker" 
            className={location.pathname === '/nutrition-tracker' ? 'active' : ''}
          >
            Nutrition Tracker
          </Link>
        </li>
        <li>
          <button onClick={onLogout} className="btn btn-secondary">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation 