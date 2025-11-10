export interface CompanyInfo {
  name_en: string
  name_mr: string
  tagline_en: string
  tagline_mr: string
  address: string
  phone: string
  email: string
  mapEmbedUrl?: string
  social: {
    facebook?: string
    youtube?: string
    whatsapp?: string
    [key: string]: string | undefined
  }
  [key: string]: unknown
}


