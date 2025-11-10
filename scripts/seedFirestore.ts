import 'dotenv/config'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, setDoc, doc } from 'firebase/firestore'
import companyInfo from '../src/data/companyInfo.json'
import services from '../src/data/services.json'
import gallery from '../src/data/gallery.json'
import videos from '../src/data/videos.json'
import blogs from '../src/data/blogs.json'
import testimonials from '../src/data/testimonials.json'

const aboutUs = {
  ownerName_en: 'Kunal Surana',
  ownerName_mr: 'कुनाल सुराना',
  ownerPhoto: 'https://example.com/kunal-surana.jpg',
  careerDetails_en:
    'Founder of VastuAntara, with years of experience blending ancient Vastu Shastra principles with modern architectural design. Known for helping individuals and organizations create spaces that foster balance, growth, and prosperity.',
  careerDetails_mr:
    'वास्तुअंतरा चे संस्थापक, ज्यांचा उद्देश पारंपरिक वास्तुशास्त्र आणि आधुनिक वास्तुशिल्प यांचा सुंदर मेळ घालून लोकांच्या जीवनात संतुलन आणि प्रगती आणणे आहे.',
  careerDetails:
    'Founder of VastuAntara, with years of experience blending ancient Vastu Shastra principles with modern architectural design. Known for helping individuals and organizations create spaces that foster balance, growth, and prosperity.',
  vision_en:
    'To guide people toward creating healthy, peaceful, and prosperous environments through authentic Vastu wisdom integrated with modern living.',
  vision_mr:
    'प्रामाणिक वास्तु ज्ञान आणि आधुनिक जीवनशैली यांच्या समन्वयातून आरोग्यदायी, शांत आणि समृद्ध वातावरण निर्मितीसाठी मार्गदर्शन करणे.',
  vision:
    'To guide people toward creating healthy, peaceful, and prosperous environments through authentic Vastu wisdom integrated with modern living.',
  mission_en:
    'To make Vastu science accessible worldwide by delivering clear, practical, and personalized guidance for homes, businesses, and spiritual spaces.',
  mission_mr:
    'घर, व्यवसाय आणि आध्यात्मिक जागांसाठी स्पष्ट, व्यावहारिक आणि वैयक्तिक मार्गदर्शन देऊन वास्तुशास्त्र सर्वांसाठी सुलभ करणे.',
  mission:
    'To make Vastu science accessible worldwide by delivering clear, practical, and personalized guidance for homes, businesses, and spiritual spaces.',
  websitePurpose_en:
    'VastuAntara was founded to share Vastu knowledge in a modern, approachable way. This website connects clients, learners, and enthusiasts with trusted Vastu insights and professional consultation options.',
  websitePurpose_mr:
    'वास्तुज्ञान आधुनिक व सोप्या पद्धतीने सर्वांसमोर आणण्यासाठी वास्तुअंतराची स्थापना करण्यात आली. हे संकेतस्थळ ग्राहक, विद्यार्थी आणि वास्तुप्रेमींना विश्वासार्ह वास्तु माहिती व सल्ला सेवांशी जोडते.',
  websitePurpose:
    'VastuAntara was founded to share Vastu knowledge in a modern, approachable way. This website connects clients, learners, and enthusiasts with trusted Vastu insights and professional consultation options.',
  messageFromOwner_en:
    'Namaste. I’m Kunal Surana, and my purpose through VastuAntara is to empower individuals to live and work in harmony with universal energies. Every space tells a story — and through proper alignment, that story can bring well-being, success, and peace into your life.',
  messageFromOwner_mr:
    'नमस्ते. मी कुनाल सुराना. वास्तुअंतराद्वारे प्रत्येकाला सार्वत्रिक उर्जांशी सुसंगत आयुष्य जगण्यास सक्षम बनवणे हेच माझे ध्येय आहे. प्रत्येक जागेची एक कथा असते — योग्य संतुलनाने ही कथा आनंद, यश आणि शांतता घेऊन येते.',
  messageFromOwner:
    'Namaste. I’m Kunal Surana, and my purpose through VastuAntara is to empower individuals to live and work in harmony with universal energies. Every space tells a story — and through proper alignment, that story can bring well-being, success, and peace into your life.',
  officePhoto: '',
  lastUpdated: '2025-11-10T12:00:00Z',
  updatedBy: 'admin',
}

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

console.log('Connected to Firebase Project:', process.env.VITE_FIREBASE_PROJECT_ID ?? '(not set)')

function cleanForFirestore(obj: unknown) {
  return JSON.parse(
    JSON.stringify(obj, (_, value) => {
      if (value === undefined || Number.isNaN(value) || value === Infinity) return null
      if (typeof value === 'object' && value !== null && Object.keys(value as Record<string, unknown>).length === 0) {
        return null
      }
      return value
    }),
  )
}

async function seedCollection(name: string, data: Array<Record<string, unknown>>) {
  console.log(`📁 Seeding collection: ${name} (${data.length} records)`)

  for (const item of data) {
    const safe = cleanForFirestore(item)
    const id = String(item.id || Date.now() + Math.random())

    try {
      await setDoc(doc(collection(db, name), id), safe)
      console.log(`✅ ${name}/${id}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error(`❌ Firestore rejected ${name}/${id}`)
      console.error('Error message:', message)
      console.log('---- Offending JSON record ----')
      console.log(JSON.stringify(safe, null, 2))
      console.log('--------------------------------')
      throw new Error(`Stop: ${name}/${id} has invalid field(s). Check console for JSON.`)
    }
  }

  console.log(`✅ Completed seeding ${name}`)
}

async function seed() {
  console.log('🚀 Starting Firestore Seeding...')

  try {
    await setDoc(doc(db, 'companyInfo', 'default'), cleanForFirestore(companyInfo))
    console.log('✅ companyInfo inserted')
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('❌ companyInfo failed:', message)
  }

  try {
    await setDoc(doc(db, 'about_us', 'main'), cleanForFirestore(aboutUs), { merge: true })
    console.log('✅ about_us/main inserted')
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('❌ about_us failed:', message)
  }

  await seedCollection('services', services)
  await seedCollection('gallery', gallery)
  await seedCollection('videos', videos)
  await seedCollection('blogs', blogs)
  await seedCollection('testimonials', testimonials)

  console.log('🎉 Firestore Seeding Complete!')
}

seed().catch(err => {
  console.error('🔥 Seeding aborted:', err.message)
})





