export interface OfficeImage {
  url: string
  alt_en?: string
  alt_mr?: string
}

export interface ContactPerson {
  name: string
  role?: string
  phone?: string
  email?: string
  photoUrl?: string
}

export interface CompanyInfo {
  name_en: string
  name_mr: string
  tagline_en: string
  tagline_mr: string
  address: string
  phone: string
  email: string
  mapEmbedUrl?: string
  officeImage?: OfficeImage
  officeBlurb_en?: string
  officeBlurb_mr?: string
  reachTitle_en?: string
  reachTitle_mr?: string
  reachSubtitle_en?: string
  reachSubtitle_mr?: string
  mapDirectionsUrl?: string
  primaryContact?: ContactPerson
  secondaryContact?: ContactPerson
  [key: string]: unknown
}


