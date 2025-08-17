'use client'

import React, { useState } from 'react'
import { IoIosSend } from 'react-icons/io'
import Topbar from '../_components/Topbar/Topbar'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import { FaPlus } from 'react-icons/fa'

export default function Page () {
  const [formData, setFormData] = useState({
    branch_name: '',
    branch_head: '',
    phone_number: '',
    telephone_number: '',
    email_address_1: '',
    email_address_2: '',
    branch_location: ''
  })

  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // Handle input change
  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Submit function
  const submitForm = async () => {
    setShowConfirmModal(false)
    try {
      const response = await axios.post(
        'https://agarwal.mrshakil.com/api/contact/branch/',
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      )
      toast.success('Branch created successfully!')
      console.log('Branch created:', response.data)
      // Reset form
      setFormData({
        branch_name: '',
        branch_head: '',
        phone_number: '',
        telephone_number: '',
        email_address_1: '',
        email_address_2: '',
        branch_location: ''
      })
    } catch (error) {
      toast.error('Failed to create branch')
      console.error(error)
    }
  }

  return (
    <div>
      <Topbar text='Create Branch' DashboardIcon={FaPlus} />
      <div className='ad_section_space'>
        <div className='pb-10'>
          <h1 className='text-2xl font-semibold mb-0.5 text-gray-800'>
            Create Branch
          </h1>
          <p className='xl:w-[35%] w-full lg:w-[80%] text-sm'>
            Enter all necessary branch details, including name, head, contact
            information, and location, then submit to add a new branch and keep
            your organization updated efficiently.
          </p>
        </div>

        <div className='space-y-6 grid grid-cols-2 gap-x-5'>
          {[
            { label: 'Branch Name', name: 'branch_name' },
            { label: 'Head Of Branch', name: 'branch_head' },
            { label: 'Phone Number', name: 'phone_number' },
            { label: 'Telephone Number', name: 'telephone_number' },
            { label: 'Email Address 1', name: 'email_address_1' },
            { label: 'Email Address 2', name: 'email_address_2' },
            { label: 'Branch Location', name: 'branch_location' }
          ].map(({ label, name }) => (
            <div key={name}>
              <label className='block text-gray-700 font-medium mb-1'>
                {label}
              </label>
              <input
                type='text'
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={`Enter ${label}`}
                className='w-full px-4 py-2 rounded text-sm text-black border border-black/10 outline-none'
                required
              />
            </div>
          ))}

          <div className='col-span-2 mt-5'>
            <button
              type='button'
              onClick={() => setShowConfirmModal(true)}
              className='cursor-pointer py-2 px-6 bg-gray-900 text-white rounded flex items-center justify-center gap-x-2 hover:bg-gray-800 transition'
            >
              <IoIosSend size={20} />
              Submit
            </button>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg p-6 w-80 shadow-lg'>
              <h3 className='text-lg font-bold mb-4 text-center text-[#1D204E]'>
                Confirm Submission
              </h3>
              <p className='text-sm text-gray-600 mb-6 text-center'>
                Are you sure you want to submit this branch information?
              </p>
              <div className='flex justify-between gap-4'>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className='flex-1 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer'
                >
                  Cancel
                </button>
                <button
                  type='button'
                  onClick={submitForm}
                  className='flex-1 py-2 bg-[#56B84A] text-white rounded hover:bg-[#4aa540] cursor-pointer'
                >
                  Yes, Submit
                </button>
              </div>
            </div>
          </div>
        )}

        <Toaster position='top-center' />
      </div>
    </div>
  )
}
