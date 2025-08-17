'use client'

import React, { useState } from 'react'
import JoditEditor from 'jodit-react'
import axios from 'axios'
import Topbar from '../_components/Topbar/Topbar'
import { BsBagPlus } from 'react-icons/bs'
import { IoCreateOutline } from 'react-icons/io5'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function JobPostForm () {
  const [jobTitle, setJobTitle] = useState('')
  const [jobSummary, setJobSummary] = useState('')
  const [jobDescriptions, setJobDescriptions] = useState('')
  const [deadline, setDeadline] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const router = useRouter()

  // Step 1: Show confirmation modal
  const handleSubmit = e => {
    e.preventDefault()
    setShowConfirmModal(true)
  }

  // Step 2: Send POST request via Axios
  const submitForm = async () => {
    const payload = {
      job_title: jobTitle,
      job_summary: jobSummary,
      job_descriptions: jobDescriptions,
      deadline: deadline
    }

    try {
      const res = await axios.post(
        'https://agarwal.mrshakil.com/api/career/job-post/',
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
            // Authorization: `Bearer ${token}`, // if needed
          }
        }
      )

      console.log('Job created successfully:', res.data)
      toast.success('Job post created successfully!')
      router.push('/manage-jobs')

      setShowToast(true)
      setShowConfirmModal(false) // close modal
    } catch (error) {
      console.error('Error creating job:', error)
      alert('Failed to post job.')
    }
  }

  return (
    <>
      <div>
        <Topbar text='Create Job' DashboardIcon={BsBagPlus}></Topbar>

        <div className='ad_section_space'>
          <div className='pb-10'>
            <h1 className='text-2xl font-semibold mb-0.5 text-gray-800'>
              Create a new job
            </h1>
            <p className='xl:w-[35%] w-full lg:w-[80%] text-sm'>
              Post job openings effortlessly, manage details, attract qualified
              candidates, and connect with the right talent to streamline your
              hiring process efficiently and effectively.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-5'>
            <div className='grid md:grid-cols-2 gap-x-5'>
              <div>
                <label className='mb-2 text-base font-medium text-black/80'>
                  Job Title
                </label>
                <input
                  type='text'
                  placeholder='Job Title'
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  className='w-full border p-2 rounded border-black/10 outline-none'
                  required
                />
              </div>

              <div>
                <label className='mb-2 text-base font-medium text-black/80'>
                  Deadline
                </label>
                <input
                  type='date'
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className='w-full border p-2 rounded border-black/10 outline-none'
                  required
                />
              </div>
            </div>

            <div>
              <label className='mb-2 text-base font-medium text-black/80'>
                {' '}
                Job Summary
              </label>
              <textarea
                placeholder='Job Summary'
                value={jobSummary}
                onChange={e => setJobSummary(e.target.value)}
                className='w-full border p-2 rounded border-black/10 outline-none'
                required
              />
            </div>

            <div>
              <label className='mb-2 text-base font-medium text-black/80'>
                {' '}
                Job Descriptions
              </label>
              <JoditEditor
                value={jobDescriptions}
                onBlur={newContent => setJobDescriptions(newContent)}
                onChange={() => {}}
              />
            </div>

            <button
              type='submit'
              className='bg-gray-900 text-white px-4 py-2 rounded flex items-center gap-x-1.5 mt-10 cursor-pointer'
            >
              Create Job <IoCreateOutline />
            </button>
          </form>

          {/* Confirmation Modal */}
          {showConfirmModal && (
            <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
              <div className='bg-white rounded-lg p-6 w-80 shadow-lg'>
                <h3 className='text-lg font-bold mb-4 text-center text-[#1D204E]'>
                  Confirm Submission
                </h3>
                <p className='text-sm text-gray-600 mb-6 text-center'>
                  Want to submit this job post?
                </p>
                <div className='flex justify-between gap-4'>
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className='flex-1 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitForm}
                    className='flex-1 py-2 bg-[#56B84A] text-white rounded hover:bg-[#4aa540] cursor-pointer'
                  >
                    Yes, Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Toast Notification */}
          <Toaster position='top-center' />
        </div>
      </div>
    </>
  )
}
