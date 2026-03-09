import React from 'react'
import AboutHeroSection from '../../usercomponents/AboutHeroSection'
import MissionSection from '../../usercomponents/MissionSection'
import Tradions from '../../usercomponents/Tradions'
import ValuesSection from '../../usercomponents/ValuesSection'
import GetInTouchSection from '../../usercomponents/GetInTouchSection'

const About = () => {
    return (
        <div className='flex flex-col gap-16'>
            <AboutHeroSection />
            <MissionSection />
            <Tradions />
            <ValuesSection />
            <GetInTouchSection/>
        </div>
    )
}

export default About
