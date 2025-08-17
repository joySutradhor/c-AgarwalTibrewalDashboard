// _components/AuthWrapper.jsx (client component)
'use client'
import { useEffect, useState } from 'react'
import Sidebar from './Sidebar/Sidebar'
import LoginPage from './LoginPage'
// import "./loader.css"

export default function AuthWrapper ({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
    setLoading(false)
  }, [])

  if (loading)
    return (
      <div className='flex justify-center items-center h-screen w-screen'>
        <p className='text-center mt-10'>Loading...</p>
      </div>
    )

    
    // if (loading) return <div className="loader"></div>

  return isLoggedIn ? (
    <section className='grid lg:grid-cols-[20%_80%] xl:grid-cols-[15%_85%] lg:justify-between min-h-screen'>
      <Sidebar />
      <main>{children}</main>
    </section>
  ) : (
    <LoginPage />
  )
}
