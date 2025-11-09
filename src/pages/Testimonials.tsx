import TestimonialCard from '../components/TestimonialCard'

const testimonials = [
  {
    id: '1',
    name: 'Amit Joshi',
    message: 'Our family has experienced a profound sense of calm after adapting the recommended changes.',
  },
  {
    id: '2',
    name: 'Meera Patil',
    message: 'Their guidance helped us re-energise our workspace; team morale is higher than ever.',
  },
  {
    id: '3',
    name: 'Chaitanya Rao',
    message: 'A perfect blend of tradition and practical modern advice. Truly transformative.',
  },
]

export default function Testimonials() {
  return (
    <section className="section-wrapper">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <h1 className="section-heading">Client Testimonials</h1>
          <div className="mx-auto gold-divider" />
          <p className="text-primary/70">
            Real stories from families and organisations who experienced the VastuAntara difference.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map(item => (
            <TestimonialCard key={item.id} name={item.name} message={item.message} />
          ))}
        </div>
      </div>
    </section>
  )
}

