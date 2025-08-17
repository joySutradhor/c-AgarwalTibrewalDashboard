'use client'

import React, { useState, useEffect } from 'react'
import JoditEditor from 'jodit-react'
import axios from 'axios'


import { IoCreateOutline } from 'react-icons/io5'
import toast, { Toaster } from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'
import Topbar from '@/app/_components/Topbar/Topbar'

import { PiBagSimpleDuotone } from 'react-icons/pi'

export default function JobEditForm () {
  const [jobTitle, setJobTitle] = useState('')
  const [jobSummary, setJobSummary] = useState('')
  const [jobDescriptions, setJobDescriptions] = useState('')
  const [deadline, setDeadline] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const router = useRouter()
  const { id } = useParams()
  const jobId = id

  useEffect(() => {
    if (!jobId) return
    axios
      .get(`http://agarwal.mrshakil.com/api/career/job-post/${jobId}/`)
      .then(res => {
        const job = res.data
        console.log(job)
        setJobTitle(job.job_title)
        setJobSummary(job.job_summary)
        setJobDescriptions(job.job_descriptions)
        setDeadline(job.deadline)
      })
      .catch(err => {
        console.error('Error fetching job:', err)
        toast.error('Failed to fetch job details')
      })
  }, [jobId])

  const handleSubmit = e => {
    e.preventDefault()
    setShowConfirmModal(true)
  }

  const submitForm = async () => {
    const payload = {
      job_title: jobTitle,
      job_summary: jobSummary,
      job_descriptions: jobDescriptions,
      deadline: deadline
    }

    try {
      const res = await axios.put(
        `http://agarwal.mrshakil.com/api/career/job-post/${jobId}/`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      console.log('Job updated successfully:', res.data)
      toast.success('Job post updated successfully!')
      router.push('/manage-jobs')
      setShowConfirmModal(false)
    } catch (error) {
      console.error('Error updating job:', error)
      toast.error('Failed to update job.')
    }
  }

  return (
    <>
      <div>
        <Topbar text='Update Job' DashboardIcon={PiBagSimpleDuotone}></Topbar>

        <div className='ad_section_space'>
          <div className='pb-10'>
            <h1 className='text-2xl font-semibold mb-0.5 text-gray-800'>
              Update job post
            </h1>
            <p className='xl:w-[35%] w-full lg:w-[80%] text-sm'>
             Edit and update your job opening details easily. Keep job information accurate, modify requirements, and ensure your listings attract the right candidates effectively.
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
              Update Job <IoCreateOutline />
            </button>
          </form>

          {/* Confirmation Modal */}
          {showConfirmModal && (
            <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
              <div className='bg-white rounded-lg p-6 w-80 shadow-lg'>
                <h3 className='text-lg font-bold mb-4 text-center text-[#1D204E]'>
                  Confirm Update
                </h3>
                <p className='text-sm text-gray-600 mb-6 text-center'>
                  Are you sure you want to update this job post?
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
                    Yes, Update
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
