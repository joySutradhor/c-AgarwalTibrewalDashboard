'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { FaEdit } from 'react-icons/fa'
import Topbar from '../_components/Topbar/Topbar'
import useAuthToken from '../_components/hooks/useAuthToken'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import { PiBagSimpleDuotone } from 'react-icons/pi'

export default function page () {
  const [jobPosts, setJobPosts] = useState([])
  const router = useRouter()
  const [openMenuId, setOpenMenuId] = useState(null)
  const { token } = useAuthToken()

  // Fetch jobPosts
  useEffect(() => {
    axios
      .get('https://agarwal.mrshakil.com/api/career/job-post/')
      .then(res => setJobPosts(res.data))
      .catch(err => console.error('Error fetching jobPosts:', err))
  }, [])

  // Delete job
  const handleDelete = async id => {
    console.log(id, token, 'check id ')
    try {
      await axios.delete(
        `http://agarwal.mrshakil.com/api/career/job-post/${id}/`,
        {
          headers: {
            Authorization: `Token ${token}`
          }
        }
      )
      toast.success('Job post deleted successfully!')
      setJobPosts(prev => prev.filter(jobPost => jobPost.id !== id))
    } catch (error) {
      console.error('Error deleting job post:', error)
      toast.error('Error deleting job post')
    }
  }

  // Toggle menu
  const toggleMenu = id => {
    setOpenMenuId(prev => (prev === id ? null : id))
  }
  console.log(jobPosts)
  return (
    <div>
      <Topbar text='Manage job posts' DashboardIcon={PiBagSimpleDuotone} />
      <div className='ad_section_space'>
        <div className='pb-10'>
          <h1 className='text-2xl font-semibold mb-0.5 text-gray-800'>
            Manage Job Posts
          </h1>
          <p className='xl:w-[35%] w-full lg:w-[80%] text-sm'>
            Easily view, update, and organize all your job postings. Keep
            listings current, track applications, and ensure your opportunities
            reach the right candidates efficiently.
          </p>
        </div>

        <div className='tableOverFlow'>
          <div className='overflow-x-auto'>
            <table className=' table-auto  w-full border-collapse text-left'>
              <thead>
                <tr>
                  <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-sm'>
                    #SL
                  </th>
                  <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-sm'>
                    Deadline
                  </th>
                  <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-sm'>
                    Posted Date
                  </th>
                  <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-sm'>
                    Job Title
                  </th>
                  <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-sm'>
                    Job Summery
                  </th>
                  <th className=' px-4 py-2 text-black/70 text-sm'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobPosts.map((jobPost, i) => (
                  <tr key={jobPost.id} className='hover:bg-gray-100'>
                    <td className=' border-l-0 border-t-[1px]  border-black/10 px-4 py-2 text-black/70 text-sm '>
                      {i + 1}
                    </td>
                    {/* <td className='border border-gray-300 px-4 py-2'>{jobPost.slug}</td> */}
                    <td className='border-l-[1px] border-t-[1px]  border-black/10 px-4 py-2 text-black/70 text-sm font-medium'>
                      {' '}
                      {new Date(jobPost?.deadline).toLocaleDateString()}{' '}
                    </td>
                    <td className='border-l-[1px] border-t-[1px]  border-black/10 px-4 py-2 text-black/70 text-sm font-medium'>
                      {' '}
                      {new Date(jobPost?.posted_date).toLocaleDateString()}{' '}
                    </td>
                    <td className='border-l-[1px] border-t-[1px]  border-black/10 px-4 py-2 text-black/70 text-sm font-medium'>
                      {jobPost.job_title}
                    </td>
                    <td className='border-l-[1px] border-t-[1px]  border-black/10 px-4 py-2 text-black/70 text-sm  line-clamp-2 leading-loose'>
                      {jobPost.job_summary}
                    </td>

                    <td className='border-l-[1px] border-t-[1px]  border-black/10 px-4 py-2 text-black/70 text-sm text-center relative'>
                      <div className='flex items-center gap-x-1.5'>
                        <Link href={`/manage-jobs/${jobPost.id}`}>
                          <button className=' text-left px-4 py-2 text-sm text-black/80 bg-green-100  rounded-md cursor-pointer'>
                            Update
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(jobPost.id)}
                          className=' text-left px-4 py-2 text-sm  text-red-600 bg-red-50 rounded-md cursor-pointer'
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {jobPosts.length === 0 && (
                  <tr>
                    <td colSpan='5' className='text-center py-4'>
                      No jobPosts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Toast Notification */}
      <Toaster position='top-center' />
    </div>
  )
}
