'use client'
import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { FaNetworkWired } from 'react-icons/fa'
import { PiBagSimpleDuotone } from 'react-icons/pi'
import { BsBagPlus } from 'react-icons/bs'
import { LuLayoutDashboard } from 'react-icons/lu'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { MdOutlineManageHistory, MdAdd } from 'react-icons/md'
import { FaUserGraduate } from 'react-icons/fa6'
import Image from 'next/image'
import logo from '@/public/logo.jpg'
import { HiMenu, HiX } from 'react-icons/hi'

export default function Sidebar () {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LuLayoutDashboard /> },
    {
      name: 'Job Applications',
      path: '/job-applicant',
      icon: <FaUserGraduate />
    },
    {
      name: 'Create Blog',
      path: '/create-blog',
      icon: <IoIosAddCircleOutline />
    },
    {
      name: 'Manage Blogs',
      path: '/manage-blog',
      icon: <MdOutlineManageHistory />
    },
    { name: 'Create Job', path: '/create-job', icon: <BsBagPlus /> },
    { name: 'Manage Jobs', path: '/manage-jobs', icon: <PiBagSimpleDuotone /> },
    { name: 'Create Branch', path: '/branch', icon: <MdAdd /> },
    { name: 'Manage Branch', path: '/manage-branch', icon: <FaNetworkWired /> }
  ]

  return (
    <>
      {/* Mobile Header */}
      <div className='lg:hidden flex items-center justify-between bg-gray-50 p-4 border-b border-gray-200'>
        <Image
          src={logo}
          alt='logo'
          height={500}
          width={500}
          className='h-10 w-auto object-cover'
        />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='text-2xl text-black/70 focus:outline-none'
        >
          {isOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Sidebar for LG+ */}
      <div className='hidden lg:flex lg:flex-col lg:min-h-screen lg:bg-gray-50 lg:text-black/80 lg:p-6'>
        <div className='mb-5'>
          <Image
            src={logo}
            alt='logo'
            height={500}
            width={500}
            className='h-10 w-fit object-cover'
          />
        </div>
        <ul className='space-y-4'>
          {navItems.map(item => {
            const isActive = pathname === item.path
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gray-200 text-gray-900 font-semibold'
                      : 'hover:bg-gray-200'
                  }`}
                >
                  <span className='text-lg'>{item.icon}</span>
                  <span className='text-sm'>{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Mobile Sidebar Drawer */}
      {isOpen && (
        <div className='lg:hidden fixed inset-0 bg-black/40 z-50 '>
          <div className='bg-gray-50 w-64 h-full p-6'>
            <div className='mb-5 flex items-center justify-between'>
              <Image
                src={logo}
                alt='logo'
                height={100}
                width={100}
                className='h-10 w-fit object-cover'
              />
              <button
                onClick={() => setIsOpen(false)}
                className='text-2xl text-black/70'
              >
                <HiX />
              </button>
            </div>
            <ul className='space-y-4'>
              {navItems.map(item => {
                const isActive = pathname === item.path
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-gray-200 text-gray-900 font-semibold'
                          : 'hover:bg-gray-200'
                      }`}
                    >
                      <span className='text-lg'>{item.icon}</span>
                      <span className='text-sm'>{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
