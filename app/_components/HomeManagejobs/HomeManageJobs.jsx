'use client'

import axios from 'axios'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function HomeManageJobs () {
  const [jobPosts, setJobPosts] = useState([])

  // Fetch jobPosts
  useEffect(() => {
    axios
      .get('https://agarwal.mrshakil.com/api/career/job-post/')
      .then(res => setJobPosts(res.data.slice(0, 5)))
      .catch(err => console.error('Error fetching jobPosts:', err))
  }, [])

  return (
    <div className='tableOverFlow'>
      <div className='ad_section_space'>
        <div className='pb-10'>
          <h1 className='text-base font-semibold mb-0.5 text-black/80'>
            Recent Job Posts
          </h1>
          <p className='xl:w-[35%] w-full lg:w-[80%] text-sm'>
            Easily view, update, and organize all your job postings. Keep
            listings current, track applications, and ensure your opportunities
            reach the right candidates efficiently.
          </p>
        </div>

        <div className='overflow-x-auto'>
          <table className='table-auto  w-full border-collapse text-left'>
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
                  <td className='border-l-[1px] border-t-[1px] line-clamp-2 leading-loose border-black/10 px-4 py-2 text-black/70 text-sm '>
                    {jobPost.job_summary}
                  </td>
                  <td className='border-l-[1px] border-t-[1px]  border-black/10 px-4 py-2 text-black/70 text-sm text-nowrap'>
                    <Link href={'/manage-jobs'}>
                      <button className='bg-gray-100 py-1 px-4 text-sm cursor-pointer'>
                        View All
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
              {jobPosts.length === 0 && (
                <tr>
                  <td colSpan='5' className='text-center py-4 text-sm'>
                    No job posts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
