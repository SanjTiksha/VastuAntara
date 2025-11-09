import BlogCard from '../components/BlogCard'

const demoBlogs = [
  {
    id: '1',
    slug: 'introducing-vastuantaras-approach',
    title: 'Introducing VastuAntara’s Holistic Approach',
    excerpt: 'Discover the pillars that guide every consultation and why our method delivers lasting harmony.',
    publishDate: new Date().toISOString(),
  },
  {
    id: '2',
    slug: 'vastu-tips-for-modern-apartments',
    title: 'Vastu Tips for Modern Apartments',
    excerpt: 'Practical adjustments that align energy in compact urban homes without major renovation.',
    publishDate: new Date().toISOString(),
  },
]

export default function Blogs() {
  return (
    <section className="section-wrapper">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="section-heading">Blog</h1>
          <div className="gold-divider" />
          <p className="text-primary/70">Insights, case studies, and Vastu wisdom—soon to sync with Firestore content.</p>
        </header>
        <div className="grid gap-6 md:grid-cols-2">
          {demoBlogs.map(blog => (
            <BlogCard key={blog.id} {...blog} excerpt={blog.excerpt} image="" />
          ))}
        </div>
      </div>
    </section>
  )
}

