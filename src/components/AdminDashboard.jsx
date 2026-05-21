import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import FeedbackItem from './FeedbackItem'

export default function AdminDashboard() {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')

  const fetchFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setFeedbacks(data)
    } catch (error) {
      console.error('Error fetching feedback:', error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedbacks()

    // Subscribe to realtime changes
    const channel = supabase
      .channel('feedback-changes')
      .on(
        'postgres_changes',
        { event: '*', table: 'feedback', schema: 'public' },
        (payload) => {
          console.log('Change received!', payload)
          // Simple approach: re-fetch everything to ensure order and consistency
          // Alternatively, modify the state directly
          fetchFeedbacks()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const categories = ['All', ...new Set(feedbacks.map((f) => f.category))]

  const filteredFeedbacks = feedbacks.filter((f) => {
    const categoryMatch = filterCategory === 'All' || f.category === filterCategory
    const statusMatch =
      filterStatus === 'All' ||
      (filterStatus === 'Reviewed' && f.is_reviewed) ||
      (filterStatus === 'Pending' && !f.is_reviewed)
    return categoryMatch && statusMatch
  })

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleSignOut} className="btn-secondary">Sign Out</button>
      </header>

      <section className="filters">
        <div className="filter-group">
          <label>Category:</label>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
          </select>
        </div>
      </section>

      {loading ? (
        <p>Loading feedbacks...</p>
      ) : (
        <div className="feedback-list">
          {filteredFeedbacks.length === 0 ? (
            <p className="no-feedback">No feedback items found.</p>
          ) : (
            filteredFeedbacks.map((item) => (
              <FeedbackItem key={item.id} item={item} onUpdate={fetchFeedbacks} />
            ))
          )}
        </div>
      )}
    </div>
  )
}
