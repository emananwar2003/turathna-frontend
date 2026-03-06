import React from 'react'
import HeroSection from '../../usercomponents/HeroSection'
import RegionsSection from '../../usercomponents/RegionsSection'
import OurStorySection from '../../usercomponents/OurStorySection'
import CategoriesSection from '../../usercomponents/CategoriesSection'
import WorkshopsSection from '../../usercomponents/WorkshopsSection'
import Footer from '../../usercomponents/Footer'

const Home = () => {
  return (
    <div>
      <HeroSection />
      <RegionsSection />
      <OurStorySection />
      <CategoriesSection />
      <WorkshopsSection />
      <Footer/>
 
    </div>
  )
}

export default Home
