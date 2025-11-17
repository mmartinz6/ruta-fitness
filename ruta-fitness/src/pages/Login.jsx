import React from 'react'

import Navbar from '../components/navbar/Navbar'
import FormLogin from '../components/loginUsuario/FormLogin'
import Footer from '../components/footer/Footer'

function Login() {
  return (
    <div>
        <Navbar />
        <FormLogin />
        <Footer />
    </div>
  )
}

export default Login