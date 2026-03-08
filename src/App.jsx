import React from 'react'
import MedicalNavbar from './Pages/Navbar'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import HeroSection from './Components/Herosection'
import Contact from './Pages/Contact'
import ServicePage from './Pages/ServicePage'
import ErrorPage from './Pages/ErrorPage'
import About from './Pages/About'
import Admin from './Pages/Admin'
import AppointmentForm from './Pages/AppointmentForm'


function App() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <BrowserRouter>
      <MedicalNavbar/>
       <Routes>
        <Route path='/' element={<HeroSection/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/services' element={<ServicePage/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/myadmin' element={<Admin/>}/>
        <Route path='*' element={<ErrorPage/>}/>
        <Route path='/abc' element={<AppointmentForm/>}/>
       </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
