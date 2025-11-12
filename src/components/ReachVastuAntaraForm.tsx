import { useMemo, useState } from 'react'
import { useLocaleContext } from '../context/LocaleContext'
import toast from 'react-hot-toast'

type PurposeKey = 'general' | 'consultation' | 'advice' | 'business'

interface FormState {
  name: string
  email: string
  phone: string
  purpose: PurposeKey
  message: string
}

const INITIAL_STATE: FormState = {
  name: '',
  email: '',
  phone: '',
  purpose: 'general',
  message: '',
}

interface ReachVastuAntaraFormProps {
  whatsappNumber?: string
  title?: string
  subtitle?: string
  id?: string
}

export default function ReachVastuAntaraForm({ whatsappNumber, title, subtitle, id }: ReachVastuAntaraFormProps) {
  const { dict } = useLocaleContext()
  const [form, setForm] = useState<FormState>(INITIAL_STATE)

  const formDict = dict.contactPage?.form ?? {
    title: 'Reach VastuAntara',
    subtitle: 'Share your details and we’ll connect with you personally on WhatsApp within 24 hours.',
    nameLabel: 'Name',
    emailLabel: 'Email',
    emailPlaceholder: 'Optional',
    phoneLabel: 'Phone',
    phonePlaceholder: 'e.g. 9876543210',
    purposeLabel: 'Purpose',
    purposeOptions: {
      general: 'General Enquiry',
      consultation: 'Book Consultation',
      advice: 'Vastu Advice',
      business: 'Business Collaboration',
    },
    messageLabel: 'Message',
    messagePlaceholder: 'Tell us about your space or question...',
    submit: 'Send via WhatsApp',
    toast: 'Opening WhatsApp to send your enquiry ✨',
  }

  const isMobile = useMemo(() => /Android|iPhone|iPad|iPod/i.test(typeof navigator !== 'undefined' ? navigator.userAgent : ''), [])

  const resolvedTitle = title || formDict.title
  const resolvedSubtitle = subtitle || formDict.subtitle

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!whatsappNumber) {
      toast.error('WhatsApp number is currently unavailable. Please try again later.')
      return
    }

    const purposeLabel = formDict.purposeOptions[form.purpose]

    const lines = [
      `*${purposeLabel} – VastuAntara Website*`,
      `${formDict.nameLabel}: ${form.name}`,
      `${formDict.emailLabel}: ${form.email || 'N/A'}`,
      `${formDict.phoneLabel}: ${form.phone}`,
      `${formDict.purposeLabel}: ${purposeLabel}`,
      `${formDict.messageLabel}: ${form.message || 'N/A'}`,
    ]

    const encodedText = encodeURIComponent(lines.join('\n'))

    const waUrl = isMobile
      ? `whatsapp://send?phone=${whatsappNumber}&text=${encodedText}`
      : `https://wa.me/${whatsappNumber}?text=${encodedText}`

    window.open(waUrl, '_blank', 'noopener,noreferrer')
    toast.success(formDict.toast)
    setForm(INITIAL_STATE)
  }

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className="card-surface mx-auto max-w-xl space-y-4 rounded-3xl bg-white p-6 shadow-soft-card md:p-8"
    >
      <header className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-primary md:text-3xl">{resolvedTitle}</h2>
        <p className="text-sm text-primary/60 md:text-base">{resolvedSubtitle}</p>
      </header>

      <div>
        <label className="mb-1 block text-sm font-semibold text-primary" htmlFor="reach-name">
          {formDict.nameLabel}
        </label>
        <input
          id="reach-name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full rounded-full border border-primary/20 bg-white px-4 py-3 text-sm text-primary placeholder:text-primary/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-primary" htmlFor="reach-email">
          {formDict.emailLabel}
        </label>
        <input
          id="reach-email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder={formDict.emailPlaceholder}
          className="w-full rounded-full border border-primary/20 bg-white px-4 py-3 text-sm text-primary placeholder:text-primary/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-primary" htmlFor="reach-phone">
          {formDict.phoneLabel}
        </label>
        <input
          id="reach-phone"
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          placeholder={formDict.phonePlaceholder}
          className="w-full rounded-full border border-primary/20 bg-white px-4 py-3 text-sm text-primary placeholder:text-primary/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          pattern="[0-9+\- ]{7,16}"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-primary" htmlFor="reach-purpose">
          {formDict.purposeLabel}
        </label>
        <select
          id="reach-purpose"
          name="purpose"
          value={form.purpose}
          onChange={handleChange}
          className="w-full rounded-full border border-primary/20 bg-white px-4 py-3 text-sm text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        >
          {(Object.keys(formDict.purposeOptions) as PurposeKey[]).map(option => (
            <option key={option} value={option}>
              {formDict.purposeOptions[option]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-primary" htmlFor="reach-message">
          {formDict.messageLabel}
        </label>
        <textarea
          id="reach-message"
          name="message"
          rows={3}
          value={form.message}
          onChange={handleChange}
          placeholder={formDict.messagePlaceholder}
          className="w-full rounded-3xl border border-primary/20 bg-white px-4 py-3 text-sm text-primary placeholder:text-primary/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-gradient-to-r from-primary via-primary to-accent px-6 py-3 text-sm font-semibold text-siteWhite shadow-soft-card transition hover:from-primary/90 hover:via-primary/90 hover:to-accent/90"
      >
        {formDict.submit}
      </button>
    </form>
  )
}
