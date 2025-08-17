'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Topbar from '../_components/Topbar/Topbar'
import { FaUserGraduate } from 'react-icons/fa'

export default function Page () {
  const [jobApplications, setJobApplications] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch all job applicants
  useEffect(() => {
    axios
      .get('https://agarwal.mrshakil.com/api/career/job-applicant/')
      .then(res => setJobApplications(res.data))
      .catch(err => console.error('Error fetching job applicants:', err))
  }, [])

  // Filter applicants by name
  const filteredApplications = jobApplications.filter(app =>
    app.candiate_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='tableOverFlow'>
      <Topbar text='Job Applicatons' DashboardIcon={FaUserGraduate} />
      <div className='ad_section_space'>
        <div className='pb-1 flex flex-col  gap-3 mt-0 lg:mt-10 '>
          <div>
            <h1 className='text-xl font-semibold text-black/80'>
              Recent Job Applicants
            </h1>

            <p className='xl:w-[35%] w-full lg:w-[80%] text-sm '>
              View, edit, and organize your job applicants efficiently. Keep
              your hiring process up-to-date and engage with candidates
              effectively.
            </p>
          </div>

          <div className='flex justify-end mb-5'>
            <input
              type='text'
              placeholder='Search by Candidate Name...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='border border-black/10 px-3 py-2 rounded-md text-sm w-full md:w-1/5'
            />
          </div>
        </div>

        <div >
          <div className='overflow-x-auto'>
            <table className=' w-full border-collapse text-left text-sm '>
              <thead>
                <tr>
                  <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-nowrap'>
                    #SL
                  </th>
                  <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-nowrap'>
                    Candidate Name
                  </th>
                  <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-nowrap'>
                    Job Title
                  </th>
                  <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-nowrap'>
                    Email
                  </th>
                  <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-nowrap'>
                    Contact Number
                  </th>
                  <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-nowrap'>
                    Current Location
                  </th>
                  <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-nowrap'>
                    Gender
                  </th>
                  <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-nowrap'>
                    Marital Status
                  </th>
                  <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-nowrap'>
                    Date of Birth
                  </th>
                  <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-nowrap'>
                    Qualification
                  </th>
                  <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-nowrap'>
                    Experience (yrs)
                  </th>
                  <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-nowrap'>
                    Areas of Exposure
                  </th>
                  <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-nowrap'>
                    Key Skills
                  </th>
                  <th className='px-4 py-2 text-black/70'>Resume</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((job, i) => (
                    <tr key={job.id} className='hover:bg-gray-100'>
                      <td className='border-l-0 border-t-[1px] border-black/10 px-4 py-2 text-nowrap'>
                        {i + 1}
                      </td>
                      <td className='border-l-[1px] border-t-[1px] border-black/10 px-4 py-2 font-medium text-nowrap'>
                        {job.candiate_name}
                      </td>
                      <td className='border-l-[1px] border-t-[1px] border-black/10 px-4 py-2 text-nowrap'>
                        {job.job_title}
                      </td>
                      <td className='border-l-[1px] border-t-[1px] border-black/10 px-4 py-2 text-nowrap'>
                        {job.email}
                      </td>
                      <td className='border-l-[1px] border-t-[1px] border-black/10 px-4 py-2 text-nowrap'>
                        {job.contact_number}
                      </td>
                      <td className='border-l-[1px] border-t-[1px] border-black/10 px-4 py-2 text-nowrap '>
                        {job.current_location}
                      </td>
                      <td className='border-l-[1px] border-t-[1px] border-black/10 px-4 py-2 text-nowrap'>
                        {job.gender}
                      </td>
                      <td className='border-l-[1px] border-t-[1px] border-black/10 px-4 py-2 text-nowrap'>
                        {job.marital_status}
                      </td>
                      <td className='border-l-[1px] border-t-[1px] border-black/10 px-4 py-2 text-nowrap'>
                        {new Date(job.date_of_birth).toLocaleDateString()}
                      </td>
                      <td className='border-l-[1px] border-t-[1px] border-black/10 px-4 py-2 text-nowrap'>
                        {job.last_qualification}
                      </td>
                      <td className='border-l-[1px] border-t-[1px] border-black/10 px-4 py-2 text-nowrap'>
                        {job.experience}
                      </td>
                      <td className='border-l-[1px] border-t-[1px] border-black/10 px-4 py-2 text-nowrap'>
                        {job.areas_of_exposure}
                      </td>
                      <td className='border-l-[1px] border-t-[1px] border-black/10 px-4 py-2 text-nowrap'>
                        {job.key_skills}
                      </td>
                      <td className='border-l-[1px] border-t-[1px] border-black/10 px-4 py-2 text-nowrap'>
                        <a
                          href={job.upload_resume}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-blue-600 hover:underline text-nowrap'
                        >
                          View Resume
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='14' className='text-center py-4'>
                      No job applications found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
