import { doc, getDoc, setDoc, type Timestamp } from 'firebase/firestore'
import { firestore } from '../lib/firebase'

export interface AboutUsContent {
  ownerName_en: string
  ownerName_mr: string
  ownerPhoto: string
  officePhoto?: string
  careerDetails_en: string
  careerDetails_mr: string
  vision_en: string
  vision_mr: string
  mission_en: string
  mission_mr: string
  websitePurpose_en: string
  websitePurpose_mr: string
  messageFromOwner_en: string
  messageFromOwner_mr: string
  careerDetails: string
  vision: string
  mission: string
  websitePurpose: string
  messageFromOwner: string
  lastUpdated?: string | Timestamp
  updatedBy?: string
}

const ABOUT_COLLECTION = 'about_us'
const ABOUT_DOC = 'main'

export async function fetchAboutUs(): Promise<AboutUsContent | null> {
  const snapshot = await getDoc(doc(firestore, ABOUT_COLLECTION, ABOUT_DOC))
  if (!snapshot.exists()) return null
  const data = snapshot.data()

  return {
    ownerName_en: data.ownerName_en ?? data.ownerName ?? '',
    ownerName_mr: data.ownerName_mr ?? data.ownerName ?? '',
    ownerPhoto: data.ownerPhoto ?? '',
    officePhoto: data.officePhoto ?? '',
    careerDetails_en: data.careerDetails_en ?? data.careerDetails ?? '',
    careerDetails_mr: data.careerDetails_mr ?? data.careerDetails ?? '',
    vision_en: data.vision_en ?? data.vision ?? '',
    vision_mr: data.vision_mr ?? data.vision ?? '',
    mission_en: data.mission_en ?? data.mission ?? '',
    mission_mr: data.mission_mr ?? data.mission ?? '',
    websitePurpose_en: data.websitePurpose_en ?? data.websitePurpose ?? '',
    websitePurpose_mr: data.websitePurpose_mr ?? data.websitePurpose ?? '',
    messageFromOwner_en: data.messageFromOwner_en ?? data.messageFromOwner ?? '',
    messageFromOwner_mr: data.messageFromOwner_mr ?? data.messageFromOwner ?? '',
    careerDetails: data.careerDetails ?? '',
    vision: data.vision ?? '',
    mission: data.mission ?? '',
    websitePurpose: data.websitePurpose ?? '',
    messageFromOwner: data.messageFromOwner ?? '',
    lastUpdated: data.lastUpdated,
    updatedBy: data.updatedBy,
  }
}

export async function updateAboutUs(data: AboutUsContent) {
  const payload = {
    ...data,
    ownerName: data.ownerName_en,
    careerDetails: data.careerDetails_en,
    vision: data.vision_en,
    mission: data.mission_en,
    websitePurpose: data.websitePurpose_en,
    messageFromOwner: data.messageFromOwner_en,
  }

  await setDoc(doc(firestore, ABOUT_COLLECTION, ABOUT_DOC), payload, { merge: true })
}
