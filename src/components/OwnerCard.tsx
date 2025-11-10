import clsx from 'clsx'

interface OwnerCardProps {
  name: string
  careerDetails: string
  photoUrl: string
  className?: string
}

export default function OwnerCard({ name, careerDetails, photoUrl, className }: OwnerCardProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center gap-6 rounded-3xl border border-accent/30 bg-white/90 p-8 shadow-soft-card md:flex-row md:items-start',
        className,
      )}
    >
      <div className="flex w-full justify-center md:basis-1/5 md:justify-start md:max-w-[20%]">
        <div className="flex aspect-[3/4] w-36 items-center justify-center overflow-hidden rounded-3xl border-4 border-accent/40 bg-white shadow-md md:w-full">
          <img
            src={photoUrl}
            alt={name}
            loading="lazy"
            className="h-full w-full object-contain"
            width={256}
            height={256}
          />
        </div>
      </div>
      <div className="text-center md:basis-4/5 md:pl-8 md:text-left">
        <h2 className="text-2xl font-semibold text-primary md:text-3xl">{name}</h2>
        <p className="mt-3 text-sm text-primary/70 md:text-base">{careerDetails}</p>
      </div>
    </div>
  )
}
