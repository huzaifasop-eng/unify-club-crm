import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import MissionStrip from '@/components/sections/MissionStrip'
import Programs from '@/components/sections/Programs'
import Therapies from '@/components/sections/Therapies'
import WhoWeServe from '@/components/sections/WhoWeServe'
import Stories from '@/components/sections/Stories'
import Events from '@/components/sections/Events'
import Branches from '@/components/sections/Branches'
import GetInvolved from '@/components/sections/GetInvolved'
import AdmissionsCTA from '@/components/sections/AdmissionsCTA'
import Partners from '@/components/sections/Partners'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <MissionStrip />
        <Programs />
        <Therapies />
        <WhoWeServe />
        <Stories />
        <Events />
        <Branches />
        <GetInvolved />
        <AdmissionsCTA />
        <Partners />
      </main>
      <Footer />
    </>
  )
}
