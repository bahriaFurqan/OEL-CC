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
    <div className="app-container">
      {session ? (
        <AdminDashboard />
      ) : showLogin ? (
        <AdminLogin onBack={() => setShowLogin(false)} />
      ) : (
        <div className="public-view">
          <header>
            <h1>Anonymous Feedback Box</h1>
            <p>We value your honest feedback. It's completely anonymous.</p>
          </header>
          <FeedbackForm />
          <footer className="admin-link">
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

