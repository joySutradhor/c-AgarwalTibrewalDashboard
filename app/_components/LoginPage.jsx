'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { FiLogIn, FiLoader } from 'react-icons/fi'
import toast, { Toaster } from 'react-hot-toast'

export default function LoginPage () {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFormSubmit = e => {
    e.preventDefault()
    setShowConfirmModal(true) // open modal instead of confirm()
  }

  const handleLogin = async () => {
    setShowConfirmModal(false)
    setLoading(true)

    try {
      const response = await axios.post(
        'https://agarwal.mrshakil.com/api/auth/login/',
        formData
      )

      localStorage.setItem('token', response.data.token)
      toast.success('You have successfully logged in.')
      // Refresh the page after short delay so toast is visible
      setTimeout(() => {
        window.location.reload()
      }, 1500)

      // Optional redirect after short delay
      // setTimeout(() => window.location.href = '/dashboard', 1500);
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Login failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 p-4'>
      {/* Toast container */}
      <Toaster position='top-center' reverseOrder={false} />

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-80 shadow-lg'>
            <h3 className='text-lg font-bold mb-4 text-center text-[#1D204E]'>
              Confirm Login
            </h3>
            <p className='text-sm text-gray-600 mb-6 text-center'>
              Are you sure you want to log in with these credentials?
            </p>
            <div className='flex justify-between gap-4'>
              <button
                onClick={() => setShowConfirmModal(false)}
                className='flex-1 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer'
              >
                Cancel
              </button>
              <button
                onClick={handleLogin}
                className='flex-1 py-2 bg-[#56B84A] text-white rounded hover:bg-[#4aa540] cursor-pointer'
              >
                Yes, Login
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='w-full max-w-md bg-white p-6 rounded-lg shadow-md'>
        <h2 className='text-2xl font-bold mb-6 text-center text-[#1D204E]'>
          Login
        </h2>

        <form onSubmit={handleFormSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>User Name</label>
            <input
              type='text'
              name='username'
              value={formData.username}
              onChange={handleChange}
              required
              className='w-full p-2 border border-black/10 rounded outline-none'
              placeholder='Enter your username'
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>Password</label>
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              required
              className='w-full p-2 border border-black/10 rounded outline-none'
              placeholder='Enter your password'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='mt-5 mb-10 px-8 bg-[#56B84A] text-white font-medium py-2 rounded disabled:opacity-50 cursor-pointer flex items-center gap-2 justify-center'
          >
            {loading ? (
              <>
                <FiLoader className='animate-spin text-lg' />
                Logging in...
              </>
            ) : (
              <>
                <FiLogIn className='text-lg' />
                Login
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
