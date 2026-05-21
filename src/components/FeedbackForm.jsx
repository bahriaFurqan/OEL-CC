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
      <div className="feedback-form submitted fade-in">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{margin: '0 auto 20px', display: 'block'}}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <path d="M22 4L12 14.01l-3-3"></path>
        </svg>
        <h2>Thank You!</h2>
        <p>Your feedback has been securely submitted, totally anonymously.</p>
        <button onClick={() => setSubmitted(false)} className="btn-primary" style={{maxWidth: '250px', margin: '0 auto'}}>
          Submit More Feedback
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="feedback-form">
      
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
          rows="6"
          placeholder="Share your thoughts honestly here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        ></textarea>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? (
          <>
            <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            Submitting...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            Submit Securely
          </>
        )}
      </button>
    </form>
  )
}

