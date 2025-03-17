import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Link, Outlet } from 'react-router';

function App() {
  const [count, setCount] = useState(0)

  return (
    

    <div className="home-container">
          <div className="banner">
            <h1 className="banner-title">Brain Forge</h1>
            <div className="banner-buttons">
              <Link to="/signin" className="banner-link">
                <button className="banner-button">Sign in</button>
              </Link>
              <Link to="/signup" className="banner-link">
                <button className="banner-button">Sign up</button>
              </Link>
            </div>
          </div>
    
    <Outlet/>
    </div>
      
    
  )
}

export default App
