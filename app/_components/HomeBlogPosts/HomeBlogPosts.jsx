'use client'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function HomeBlogPosts () {
  const [blogs, setBlogs] = useState([])

  // Fetch blogs
  useEffect(() => {
    axios
      .get('https://agarwal.mrshakil.com/api/blog/blogs/')
      .then(res => setBlogs(res.data.slice(0, 5)))
      .catch(err => console.error('Error fetching blogs:', err))
  }, [])

  return (
    <div className='tableOverFlow'>
      <div className='ad_section_space'>
        <div className='pb-10'>
          <h1 className='text-base font-semibold mb-0.5 text-black/80'>
            Recent Blog Posts
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
                  <td className='border-l-[1px] border-t-[1px]  border-black/10 px-4 py-2 text-black/70 text-sm font-medium'>
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
                    <Link href={'/manage-blog'}>
                      <button className='bg-gray-100 py-1 px-4 text-sm cursor-pointer text-nowrap'>
                        View All
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td colSpan='5' className='text-center py-4 text-sm'>
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
