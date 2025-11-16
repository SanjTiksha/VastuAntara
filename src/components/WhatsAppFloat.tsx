import { MessageCircle } from 'lucide-react'
import { useLocaleContext } from '../context/LocaleContext'
import useFirestoreDoc from '../hooks/useFirestoreDoc'
import type { CompanyInfo } from '../types/company'

function extractWhatsappNumber(phone?: string | null) {
  if (!phone) return undefined
  const digits = phone.replace(/\D/g, '')
  if (digits.length >= 10) {
    return digits
  }
  return undefined
}

export default function WhatsAppFloat() {
  const { lang } = useLocaleContext()
  const { data: companyInfo } = useFirestoreDoc<CompanyInfo>('companyInfo', 'default')
  const whatsappNumber = extractWhatsappNumber(companyInfo?.phone)

  if (!whatsappNumber) return null

  const whatsappUrl = `https://wa.me/${whatsappNumber}`
  const whatsappMessage = lang === 'mr' 
    ? 'नमस्ते, मला वास्तु सल्ला हवा आहे.'
    : 'Hello, I would like to get Vastu consultation.'

  const label = lang === 'mr' ? 'व्हॉट्सअॅप' : 'WhatsApp'

  return (
    <div className="group fixed bottom-24 right-4 z-50 md:bottom-28 md:right-6">
      <a
        href={`${whatsappUrl}?text=${encodeURIComponent(whatsappMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center rounded-full bg-[#25D366] p-2.5 shadow-md transition-all hover:scale-110 hover:shadow-lg"
        aria-label={label}
      >
        <MessageCircle className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" />
      </a>
      <div className="pointer-events-none absolute right-full top-1/2 mr-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {label}
        <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
      </div>
    </div>
  )
}

