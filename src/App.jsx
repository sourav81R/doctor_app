import React from 'react'
import MedicalNavbar from './Pages/Navbar'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import HeroSection from './Components/Herosection'
import Contact from './Pages/Contact'
import ServicePage from './Pages/ServicePage'
import ErrorPage from './Pages/ErrorPage'


function App() {
  return (
    <div>
      <BrowserRouter>
      <MedicalNavbar/>
       <Routes>
        <Route path='/' element={<HeroSection/>}/>
        <Route path='/about' element={""}/>
        <Route path='/services' element={<ServicePage/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='*' element={<ErrorPage/>}/>
       </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App