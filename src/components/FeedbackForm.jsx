import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const CATEGORIES = ['General', 'Bug Report', 'Feature Request', 'Compliment', 'Other']

export default function FeedbackForm() {
  const [message, setMessage] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('feedback')
        .insert([{ message, category, is_reviewed: false }])

      if (error) throw error

      setSubmitted(true)
      setMessage('')
      setCategory(CATEGORIES[0])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="feedback-form submitted">
        <h2>Thank You!</h2>
        <p>Your feedback has been submitted anonymously.</p>
        <button onClick={() => setSubmitted(false)} className="btn-primary">
          Submit more feedback
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="feedback-form">
      <h2>Send us your feedback</h2>
      
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="message">Your Message</label>
        <textarea
          id="message"
          rows="5"
          placeholder="Type your feedback here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        ></textarea>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  )
}
