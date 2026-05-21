import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import FeedbackForm from './components/FeedbackForm'
import AdminDashboard from './components/AdminDashboard'
import AdminLogin from './components/AdminLogin'
import './App.css'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    // Check session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="app-container fade-in">
      {session ? (
        <AdminDashboard />
      ) : showLogin ? (
        <AdminLogin onBack={() => setShowLogin(false)} />
      ) : (
        <div className="public-view">
          <header className="fade-in delay-1">
            <div className="icon-container">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
              </svg>
            </div>
            <h1>Speak Your Mind</h1>
            <p>We value your honest feedback. It's completely anonymous and securely delivered directly to our team.</p>
          </header>
          
          <div className="fade-in delay-2">
            <FeedbackForm />
          </div>
          
          <footer className="admin-link fade-in delay-3">
            <button onClick={() => setShowLogin(true)} className="btn-link">
              Admin Access
            </button>
          </footer>
        </div>
      )}
    </div>
  )
}

export default App


