'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Topbar from '../_components/Topbar/Topbar'
import { MdOutlineManageHistory } from 'react-icons/md'
import { FaEdit } from 'react-icons/fa'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function Page () {
  const [branches, setBranches] = useState([])

  // Fetch branch data
  useEffect(() => {
    axios
      .get('https://agarwal.mrshakil.com/api/contact/branch/')
      .then(res => setBranches(res.data))
      .catch(err => console.error('Error fetching branches:', err))
  }, [])

  // Delete branch
  const handleDelete = async id => {
    try {
      await axios.delete(
        `http://agarwal.mrshakil.com/api/contact/branch/${id}/`
      )
      toast.success('Branch deleted successfully!')
      setBranches(prev => prev.filter(branch => branch.id !== id))
    } catch (error) {
      console.error('Error deleting branch:', error)
      toast.error('Failed to delete branch')
    }
  }

  return (
    <div>
      <Topbar text='Manage Branch' DashboardIcon={MdOutlineManageHistory} />
      <div className='ad_section_space'>
        <div className='pb-10'>
          <h1 className='text-2xl font-semibold mb-0.5 text-gray-800'>
            Manage Branch
          </h1>
          <p className='xl:w-[35%] w-full lg:w-[80%] text-sm'>
            View, update, and organize all your branch information in one place.
            Easily manage branch details, contact information, and locations to
            keep your organization structured and up-to-date.
          </p>
        </div>

        <div className='tableOverFlow'>
          <div className=' overflow-x-auto '>
            <table className='table-auto  w-full border-collapse text-left'>
              <thead>
                <tr>
                  <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-sm'>
                    #SL
                  </th>
                  <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-sm'>
                    Branch Name
                  </th>
                  <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-sm'>
                    Branch Head
                  </th>
                  <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-sm'>
                    Phone
                  </th>
                  <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-sm'>
                    Telephone
                  </th>
                  <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-sm'>
                    Email 1
                  </th>
                  <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-sm'>
                    Email 2
                  </th>
                  <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-sm'>
                    Location
                  </th>
                  <th className='px-4 py-2 text-black/70 text-sm'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {branches.map((branch, i) => (
                  <tr key={branch.id} className='hover:bg-gray-100  '>
                    <td className='border-l-0 border-t-[1px] border-black/10 px-4 py-2 text-black/70 text-sm'>
                      {i + 1}
                    </td>
                    <td className='border-l-[1px] border-t-[1px] border-black/10 px-4 py-2 text-black/70 text-sm font-medium'>
                      {branch.branch_name}
                    </td>
                    <td className='border-l-[1px] border-t-[1px] border-black/10 px-4 py-2 text-black/70 text-sm font-medium'>
                      {branch.branch_head}
                    </td>
                    <td className='border-l-[1px] border-t-[1px] border-black/10 px-4 py-2 text-black/70 text-sm text-nowrap'>
                      {branch.phone_number}
                    </td>
                    <td className='border-l-[1px] border-t-[1px] border-black/10 px-4 py-2 text-black/70 text-sm text-nowrap'>
                      {branch.telephone_number}
                    </td>
                    <td className='border-l-[1px] border-t-[1px] border-black/10 px-4 py-2 text-black/70 text-sm text-nowrap'>
                      {branch.email_address_1}
                    </td>
                    <td className='border-l-[1px] border-t-[1px] border-black/10 px-4 py-2 text-black/70 text-sm text-nowrap'>
                      {branch.email_address_2}
                    </td>
                    <td className='border-l-[1px] border-t-[1px] border-black/10 px-4 py-2 text-black/70 text-sm '>
                      {branch.branch_location}
                    </td>
                    <td className='border-l-[1px] border-t-[1px] border-black/10 px-4 py-2 text-black/70 text-sm text-center'>
                      <div className='mt-1 flex gap-x-2 items-center '>
                        <Link href={`/manage-branch/${branch.id}`}>
                          <button className='block w-full text-left px-4 py-2 text-sm bg-green-100 text-black/80 rounded-md cursor-pointer'>
                            Update
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(branch.id)}
                          className='block w-full text-left px-4 py-2 text-sm bg-red-50 text-red-600 rounded-md cursor-pointer'
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {branches.length === 0 && (
                  <tr>
                    <td colSpan='9' className='text-center py-4'>
                      No branches found
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
