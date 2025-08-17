'use client'

import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { FaCloudUploadAlt, FaPlus } from 'react-icons/fa'
import Topbar from '../_components/Topbar/Topbar'
import { IoIosSend } from 'react-icons/io'
import toast, { Toaster } from 'react-hot-toast'
import { GrBlog } from 'react-icons/gr'
import { useRouter } from 'next/navigation'

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false })

export default function Page () {
  const editor = useRef(null)

  const [title, setTitle] = useState('')
  const [shortDesc, setShortDesc] = useState('')
  const [authorName, setWritterName] = useState('')
  const [file, setFile] = useState(null)
  const [content, setContent] = useState('')
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const router = useRouter()

  useEffect(() => {
    fetch('https://agarwal.mrshakil.com/api/blog/blog-categories/')
      .then(res => res.json())
      .then(data => {
        setCategories(data)
        if (data.length > 0) setSelectedCategory(data[0].id)
      })
      .catch(err => console.error('Error fetching categories:', err))
  }, [])

  // Actual submission logic
  const submitForm = async () => {
    console.log(selectedCategory)
    const formData = new FormData()
    formData.append('title', title)
    formData.append('writer', authorName)
    formData.append('short_summary', shortDesc)
    formData.append('content', content)
    formData.append('category', selectedCategory)

    if (file) {
      formData.append('pdf_file', file)
    }

    try {
      for (let pair of formData.entries()) {
        console.log(pair[0] + ':', pair[1])
      }
      const res = await fetch('https://agarwal.mrshakil.com/api/blog/blogs/', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error('Error response:', errorData)
        alert('Failed to submit blog post')
        return
      }

      await res.json()
      toast.success('Blog post created successfully!')
      router.push('/manage-blog')

      setShowToast(true)
      setShowConfirmModal(false)

      // Reset form
      setTitle('')
      setWritterName('')
      setShortDesc('')
      setContent('')
      setFile(null)
      setSelectedCategory(categories.length > 0 ? categories[0].id : '')

      setTimeout(() => setShowToast(false), 3000)
    } catch (error) {
      console.error('Error submitting blog post:', error)
      toast.error('Error submitting blog post')
    }
  }

  // Show modal on form submit instead of direct submit
  const handleSubmit = e => {
    e.preventDefault()
    setShowConfirmModal(true)
  }

  return (
    <div>
      <Topbar text='Create Blog' DashboardIcon={GrBlog} />
      <div className='ad_section_space'>
        <div className='pb-10'>
          <h1 className='text-2xl font-semibold mb-0.5 text-gray-800'>
            Create Blog Post
          </h1>
          <p className='xl:w-[35%] w-full lg:w-[80%] text-sm'>
            Share your insights and stories by creating a new blog post. Engage
            your audience with valuable content and fresh perspectives.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6 bg-white rounded'>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-x-5'>
            {/* Title */}
            <div>
              <label className='block mb-2 font-medium text-gray-700'>
                Blog Title
              </label>
              <input
                type='text'
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder='Enter title'
                required
                className='w-full px-4 py-2 border rounded border-black/10 outline-none'
              />
            </div>

            {/* Category Select */}
            <div>
              <label className='block mb-2 font-medium text-gray-700'>
                Select Category
              </label>
              <select
                value={selectedCategory}
                onChange={e => {
                  console.log('Selected category:', e.target.value)
                  setSelectedCategory(e.target.value)
                }}
                required
                className='w-full px-4 py-2 border rounded border-black/10 outline-none'
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.parent ? `${cat.parent} > ${cat.name}` : cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Author Name */}
            <div>
              <label className='block mb-2 font-medium text-gray-700'>
                Writer Name
              </label>
              <input
                type='text'
                value={authorName}
                onChange={e => setWritterName(e.target.value)}
                placeholder='Writer name'
                required
                className='w-full px-4 py-2 border border-black/10 rounded outline-none'
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-x-5'>
            {/* Short Description */}
            <div>
              <label className='block mb-2 font-medium text-gray-700'>
                Short Description
              </label>
              <textarea
                value={shortDesc}
                onChange={e => setShortDesc(e.target.value)}
                placeholder='Write a short description...'
                rows={3}
                required
                className='w-full px-4 py-2 border border-black/10 rounded outline-none'
              />
            </div>

            {/* File Upload */}
            <div>
              <label className='block mb-2 font-medium text-gray-700'>
                Upload File
              </label>
              <label
                htmlFor='file-upload'
                className='flex flex-col items-center justify-center w-full h-21.5 border-[1px] border-dashed border-green-400 rounded-md cursor-pointer bg-green-50 hover:bg-green-100 transition'
              >
                <FaCloudUploadAlt className='text-4xl text-green-500 mb-2' />
                <span className='font-semibold text-gray-700'>
                  Click or drag file here
                </span>
                <input
                  id='file-upload'
                  type='file'
                  className='hidden'
                  onChange={e => setFile(e.target.files[0])}
                  accept='application/pdf'
                />
              </label>
              {file && (
                <p className='mt-2 text-green-600 font-medium'>
                  Selected: {file.name}
                </p>
              )}
            </div>
          </div>

          {/* Jodit Editor */}
          <div>
            <label className='block mb-2 font-medium text-gray-700'>
              Blog Content
            </label>
            <JoditEditor
              ref={editor}
              value={content}
              tabIndex={1}
              onBlur={newContent => setContent(newContent)}
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type='submit'
              className=' cursor-pointer mt-5 mb-10 py-2 px-6 bg-gray-900 text-white rounded flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors duration-200'
            >
              <IoIosSend className='text-lg' />
              <span>Submit</span>
            </button>
          </div>
        </form>

        {/* Confirm Modal */}
        {showConfirmModal && (
          <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg p-6 w-80 shadow-lg'>
              <h3 className='text-lg font-bold mb-4 text-center text-[#1D204E]'>
                Confirm Submission
              </h3>
              <p className='text-sm text-gray-600 mb-6 text-center'>
                Want to submit this blog post?
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
  )
}
