import { useState } from 'react'
import type { FormEvent } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { useLocaleContext } from '../context/LocaleContext'
import { firestore } from '../lib/firebase'

interface ContactFormState {
  name: string
  email: string
  phone: string
  message: string
}

const initialState: ContactFormState = {
  name: '',
  email: '',
  phone: '',
  message: '',
}

export default function ContactForm() {
  const { lang } = useLocaleContext()
  const [form, setForm] = useState<ContactFormState>(initialState)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const labels = {
    name: lang === 'en' ? 'Name' : 'नाव',
    email: lang === 'en' ? 'Email' : 'ईमेल',
    phone: lang === 'en' ? 'Phone' : 'फोन',
    message: lang === 'en' ? 'Message' : 'संदेश',
    submit: lang === 'en' ? 'Submit' : 'सबमिट',
    sending: lang === 'en' ? 'Sending...' : 'पाठवत आहोत...',
    success: lang === 'en' ? 'Thank you! We will reach out shortly.' : 'धन्यवाद! आम्ही लवकरच संपर्क करू.',
    error: lang === 'en' ? 'Something went wrong. Please try again.' : 'काहीतरी चुकले. कृपया पुन्हा प्रयत्न करा.',
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('loading')
    setError(null)

    try {
      await addDoc(collection(firestore, 'messages'), {
        ...form,
        createdAt: serverTimestamp(),
        status: 'new',
      })
      setForm(initialState)
      setStatus('success')
    } catch (err) {
      console.error(err)
      setStatus('error')
      setError(labels.error)
    }
  }

  return (
    <form className="card-surface space-y-5 p-6" onSubmit={handleSubmit}>
      <div>
        <label className="mb-2 block text-sm font-semibold text-primary" htmlFor="contact-name">
          {labels.name}
        </label>
        <input
          id="contact-name"
          name="name"
          value={form.name}
          onChange={event => setForm(prev => ({ ...prev, name: event.target.value }))}
          className="w-full rounded-full border border-primary/20 bg-white px-4 py-3 text-sm text-primary placeholder:text-primary/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          required
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-primary" htmlFor="contact-email">
            {labels.email}
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            value={form.email}
            onChange={event => setForm(prev => ({ ...prev, email: event.target.value }))}
            className="w-full rounded-full border border-primary/20 bg-white px-4 py-3 text-sm text-primary placeholder:text-primary/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-primary" htmlFor="contact-phone">
            {labels.phone}
          </label>
          <input
            id="contact-phone"
            name="phone"
            value={form.phone}
            onChange={event => setForm(prev => ({ ...prev, phone: event.target.value }))}
            className="w-full rounded-full border border-primary/20 bg-white px-4 py-3 text-sm text-primary placeholder:text-primary/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            required
          />
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-primary" htmlFor="contact-message">
          {labels.message}
        </label>
        <textarea
          id="contact-message"
          name="message"
          value={form.message}
          onChange={event => setForm(prev => ({ ...prev, message: event.target.value }))}
          className="min-h-[150px] w-full rounded-3xl border border-primary/20 bg-white px-4 py-3 text-sm text-primary placeholder:text-primary/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          required
        />
      </div>
      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={status === 'loading'}>
        {status === 'loading' ? labels.sending : labels.submit}
      </button>
      {status === 'success' && <p className="text-sm text-green-600">{labels.success}</p>}
      {status === 'error' && error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  )
}

