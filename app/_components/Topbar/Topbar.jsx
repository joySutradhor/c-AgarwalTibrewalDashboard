'use client'
import React, { useState } from 'react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

import { IoMdClose } from 'react-icons/io'
import { FaKey } from 'react-icons/fa'
import { IoExitOutline } from 'react-icons/io5'
import { FiLoader } from 'react-icons/fi'

export default function Topbar ({ text, DashboardIcon }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  })

  const handleLogout = async () => {
    try {
      await axios.get('https://agarwal.mrshakil.com/api/auth/logout/', {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` }
      })
      localStorage.removeItem('token')
      toast.success('Logged out successfully.')
      window.location.reload()
    } catch (error) {
      toast.error('Logout failed. Please try again.')
    }
  }

  const handleChangePasswordSubmit = async e => {
    e.preventDefault()
    if (form.new_password !== form.confirm_password) {
      toast.error('New password and confirmation do not match.')
      return
    }
    setLoading(true)
    try {
      await axios.post(
        'https://agarwal.mrshakil.com/api/auth/change-password/',
        {
          old_password: form.old_password,
          new_password: form.new_password,
          confirm_password: form.confirm_password
        },
        {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` }
        }
      )
      toast.success('Password changed successfully.')
      setModalOpen(false)
      setForm({ old_password: '', new_password: '', confirm_password: '' })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <>
      <Toaster position='top-center' reverseOrder={false} />
      <div className='w-full py-5   bg-gray-50 border-b border-black/5 md:flex items-center justify-between px-[2vw] '>
        {/* Logo / Dashboard Title */}
        <div className='text-base lg:text-xl flex items-center gap-x-1 font-semibold text-gray-800 mb-2 lg:mb-0'>
          {DashboardIcon && <DashboardIcon />}
          {text}
        </div>

        {/* Buttons */}
        <div className='flex gap-4'>
          <button
            onClick={() => setModalOpen(true)}
            className='lg:px-6 lg:py-2 py-1 px-4 lg:text-base text-xs rounded-full border border-black/10 flex items-center gap-x-1.5 cursor-pointer  '
          >
            <FaKey className='text-gray-500' /> Change Password
          </button>
          <button
            onClick={handleLogout}
            className='lg:px-6 lg:py-2 py-1 px-4 lg:text-base text-xs rounded-full bg-[#1D204E] text-white flex items-center gap-x-1.5 cursor-pointer'
          >
            <IoExitOutline /> Logout
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {modalOpen && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-96 shadow-lg relative'>
            {/* Close button */}
            <button
              onClick={() => setModalOpen(false)}
              className='absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none'
              aria-label='Close modal'
            >
              <IoMdClose size={24} />
            </button>

            <h3 className='text-lg font-bold mb-4 text-center text-[#1D204E]'>
              Change Password
            </h3>
            <form onSubmit={handleChangePasswordSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Old Password
                </label>
                <input
                  type='text'
                  name='old_password'
                  value={form.old_password}
                  onChange={handleInputChange}
                  required
                  className='w-full p-2 border border-black/10 rounded outline-none'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  New Password
                </label>
                <input
                  type='text'
                  name='new_password'
                  value={form.new_password}
                  onChange={handleInputChange}
                  required
                  className='w-full p-2 border border-black/10 rounded outline-none'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Confirm New Password
                </label>
                <input
                  type='text'
                  name='confirm_password'
                  value={form.confirm_password}
                  onChange={handleInputChange}
                  required
                  className='w-full p-2 border border-black/10 rounded outline-none'
                />
              </div>

              <div className='flex justify-end gap-3 mt-6'>
                <button
                  type='button'
                  onClick={() => setModalOpen(false)}
                  className=' cursor-pointer px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 flex items-center gap-1'
                  disabled={loading}
                >
                  <IoMdClose className='text-lg' />
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={loading}
                  className='cursor-pointer px-4 py-2 rounded bg-[#56B84A] text-white hover:bg-[#4aa540] disabled:opacity-50 flex items-center gap-2 justify-center'
                >
                  {loading ? (
                    <>
                      <FiLoader className='animate-spin text-lg' />
                      Changing...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
