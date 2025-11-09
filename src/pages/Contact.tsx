import ContactForm from '../components/ContactForm'

export default function Contact() {
  return (
    <section className="section-wrapper bg-bgSoft">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="section-heading">Contact VastuAntara</h1>
          <div className="gold-divider" />
          <p className="text-primary/70">
            Share your enquiry and we will respond with a personalised Vastu consultation plan within 24 hours.
          </p>
        </header>
        <ContactForm />
      </div>
    </section>
  )
}

