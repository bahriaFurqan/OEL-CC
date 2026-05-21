import { supabase } from '../lib/supabaseClient'

export default function FeedbackItem({ item, onUpdate }) {
  const toggleReviewed = async () => {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ is_reviewed: !item.is_reviewed })
        .eq('id', item.id)

      if (error) throw error
      // The realtime subscription in AdminDashboard will handle the UI update,
      // but we call onUpdate just in case or if realtime is slightly delayed.
      onUpdate()
    } catch (error) {
      alert('Error updating status: ' + error.message)
    }
  }

  const deleteFeedback = async () => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return

    try {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', item.id)

      if (error) throw error
      onUpdate()
    } catch (error) {
      alert('Error deleting feedback: ' + error.message)
    }
  }

  return (
    <div className={`feedback-item ${item.is_reviewed ? 'reviewed' : 'pending'}`}>
      <div className="feedback-content">
        <div className="feedback-meta">
          <span className="badge category">{item.category}</span>
          <span className="timestamp">
            {new Date(item.created_at).toLocaleString()}
          </span>
          <span className={`badge status ${item.is_reviewed ? 'reviewed' : 'pending'}`}>
            {item.is_reviewed ? 'Reviewed' : 'Pending'}
          </span>
        </div>
        <p className="message">{item.message}</p>
      </div>
      
      <div className="feedback-actions">
        <button 
          onClick={toggleReviewed} 
          className={item.is_reviewed ? 'btn-warn' : 'btn-success'}
        >
          {item.is_reviewed ? 'Mark Pending' : 'Mark Reviewed'}
        </button>
        <button onClick={deleteFeedback} className="btn-danger">
          Delete
        </button>
      </div>
    </div>
  )
}
