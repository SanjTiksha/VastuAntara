import clsx from 'clsx'

interface SectionTitleProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  className?: string
}

export default function SectionTitle({ title, subtitle, align = 'left', className }: SectionTitleProps) {
  return (
    <header className={clsx('space-y-4', align === 'center' && 'text-center', className)}>
      <h3 className="text-2xl font-semibold text-primary md:text-3xl">{title}</h3>
      <div className={clsx('gold-divider', align === 'center' && 'mx-auto')} />
      {subtitle && <p className="text-sm text-primary/70 md:text-base">{subtitle}</p>}
    </header>
  )
}
