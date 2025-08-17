'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { HiDotsVertical } from 'react-icons/hi'
import { FaEdit } from 'react-icons/fa'
import Topbar from '../_components/Topbar/Topbar'
import useAuthToken from '../_components/hooks/useAuthToken'
import { MdOutlineManageHistory } from 'react-icons/md'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function page () {
  const [blogs, setBlogs] = useState([])
  const router = useRouter()
  const [openMenuId, setOpenMenuId] = useState(null)
  const { token } = useAuthToken()

  // Fetch blogs
  useEffect(() => {
    axios
      .get('https://agarwal.mrshakil.com/api/blog/blogs/')
      .then(res => setBlogs(res.data))
      .catch(err => console.error('Error fetching blogs:', err))
  }, [])

  // Delete blog
  const handleDelete = async id => {
    console.log(id, token, 'check id ')
    try {
      await axios.delete(`http://agarwal.mrshakil.com/api/blog/blogs/${id}/`, {
        headers: {
          Authorization: `Token ${token}`
        }
      })
      toast.success('Blog deleted successfully!')
      setBlogs(prev => prev.filter(blog => blog.id !== id))
    } catch (error) {
      console.error('Error deleting blog:', error)
      // alert('Failed to delete blog')
    }
  }

  // Toggle menu
  const toggleMenu = id => {
    setOpenMenuId(prev => (prev === id ? null : id))
  }
  console.log(blogs)
  return (
    <div className='tableOverFlow'>
      <Topbar text='Manage Blogs' DashboardIcon={MdOutlineManageHistory} />
      <div className='ad_section_space'>
        <div className='pb-10'>
          <h1 className='text-2xl font-semibold mb-0.5 text-gray-800'>
            Manage Blog Post
          </h1>
          <p className='xl:w-[35%] w-full lg:w-[80%] text-sm'>
            View, edit, and organize your blog posts efficiently. Keep your
            content up-to-date and engage your readers with relevant articles.
          </p>
        </div>
        <div className='overflow-x-auto'>
          <table className='table-auto w-full border-collapse  text-left'>
            <thead>
              <tr>
                <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-sm'>
                  #SL
                </th>
                <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-sm'>
                  Date
                </th>
                <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-sm'>
                  Category
                </th>
                <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-sm'>
                  Blog Title
                </th>
                <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-sm'>
                  Blog Summery
                </th>
                <th className='border-r-[1px] border-black/10 px-4 py-2 text-black/70 text-sm'>
                  Writer
                </th>
                <th className=' px-4 py-2 text-black/70 text-sm'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog, i) => (
                <tr key={blog.id} className='hover:bg-gray-100'>
                  <td className=' border-l-0 border-t-[1px]  border-black/10 px-4 py-2 text-black/70 text-sm '>
                    {i + 1}
                  </td>
                  {/* <td className='border border-gray-300 px-4 py-2'>{blog.slug}</td> */}
                  <td className='border-l-[1px] border-t-[1px]  border-black/10 px-4 py-2 text-black/70 text-sm font-medium'>
                    {' '}
                    {new Date(blog?.created_at).toLocaleDateString()}{' '}
                  </td>
                  <td className='border-l-[1px] border-t-[1px]  border-black/10 px-4 py-2 text-black/70 text-sm font-medium text-nowrap'>
                    {blog.category_name}
                  </td>
                  <td className='border-l-[1px] border-t-[1px]  border-black/10 px-4 py-2 text-black/70 text-sm'>
                    {blog.title}
                  </td>
                  <td className='border-l-[1px] border-t-[1px]  border-black/10 px-4 py-2 text-black/70 text-sm line-clamp-2 leading-loose'>
                    {blog.short_summary}
                  </td>
                  <td className='border-l-[1px] border-t-[1px]  border-black/10 px-4 py-2 text-black/70 text-sm'>
                    {blog.writer || 'N/A'}
                  </td>
                  <td className='border-l-[1px] border-t-[1px]  border-black/10 px-4 py-2 text-black/70 text-sm text-center relative'>
                    <div className='flex items-center gap-x-1.5'>
                      <Link href={`/manage-blog/${blog.id}`}>
                        <button className=' text-left px-4 py-2 text-sm bg-green-100 rounded-md text-black/80 cursor-pointer'>
                          Update
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className='block w-full text-left px-4 py-2 text-sm bg-red-50 rounded-md text-red-600 cursor-pointer'
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td colSpan='5' className='text-center py-4'>
                    No blogs found
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
