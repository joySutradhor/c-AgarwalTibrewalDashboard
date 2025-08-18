'use client'
import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { FiPlus } from 'react-icons/fi'
import Topbar from './_components/Topbar/Topbar'
import { IoHomeOutline } from 'react-icons/io5'
import useAuthToken from './_components/hooks/useAuthToken'
import { FaRegEdit } from 'react-icons/fa'
import { MdDeleteOutline } from 'react-icons/md'
import HomeManageJobs from './_components/HomeManagejobs/HomeManageJobs'
import HomeBlogPosts from './_components/HomeBlogPosts/HomeBlogPosts'

/** Reusable Confirm Modal */
function ConfirmModal ({
  open,
  onClose,
  onConfirm,
  des,
  message = 'Are you sure?'
}) {
  if (!open) return null
  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-96 shadow-lg'>
        <p className='text-base text-gray-700 text-center'>{message}</p>
        <p className='text-sm text-gray-700 text-center'>{des}</p>
        <div className='flex justify-center gap-3 mt-6'>
          <button
            onClick={onClose}
            className='px-4 py-2 rounded border text-sm font-medium border-gray-300 hover:bg-gray-100 cursor-pointer'
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className='px-4 py-2 rounded text-sm font-medium bg-red-500 text-white hover:bg-red-600 cursor-pointer'
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

/** Recursive Tree Renderer */
function CategoryTree ({ nodes = [], onEdit, onDelete, parentId = null }) {
  return (
    <div className=' grid md:grid-cols-2 xl:grid-cols-4 gap-5 '>
      {nodes.map(cat => (
        <div key={cat.id} className='bg-white border  border-gray-200 rounded'>
          {/* Parent Category Header */}
          <div className='flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200'>
            <span className='font-semibold text-sm text-gray-800'>
              {cat.name}
            </span>
            <div className='flex items-center gap-3'>
              <button
                onClick={() => onEdit({ id: cat.id, name: cat.name, parentId })}
                className='text-black/60 hover:text-black/80 cursor-pointer'
                title='Edit'
              >
                <FaRegEdit />
              </button>
              <button
                onClick={() => onDelete({ id: cat.id, name: cat.name })}
                className='text-red-500 hover:text-red-700 cursor-pointer'
                title='Delete'
              >
                <MdDeleteOutline />
              </button>
            </div>
          </div>

          {/* Subcategories */}
          {cat.subcategories && cat.subcategories.length > 0 ? (
            <ul className='divide-y divide-gray-100'>
              {cat.subcategories.map(sub => (
                <li
                  key={sub.id}
                  className='flex items-center justify-between px-4 py-2 hover:bg-gray-50'
                >
                  <span className='text-sm text-gray-700'>{sub.name}</span>
                  <div className='flex items-center gap-3'>
                    <button
                      onClick={() =>
                        onEdit({ id: sub.id, name: sub.name, parentId: cat.id })
                      }
                      className='text-black/60 hover:text-black/80 cursor-pointer'
                      title='Edit'
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      onClick={() => onDelete({ id: sub.id, name: sub.name })}
                      className='text-red-500 hover:text-red-700 cursor-pointer'
                      title='Delete'
                    >
                      <MdDeleteOutline />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className='px-4 py-3 text-sm text-gray-500 italic'>
              No subcategories
            </p>
          )}

          {/* Render deeper levels recursively */}
          {cat.subcategories &&
            cat.subcategories.some(s => s.subcategories?.length > 0) && (
              <div className='px-4 py-3'>
                <CategoryTree
                  nodes={cat.subcategories.filter(
                    s => s.subcategories?.length > 0
                  )}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  parentId={cat.id}
                />
              </div>
            )}
        </div>
      ))}
    </div>
  )
}

export default function CategoryManagement () {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Create modal
  const [modalOpen, setModalOpen] = useState(false)
  const [subCategoryName, setSubCategoryName] = useState('')
  const [selectedParent, setSelectedParent] = useState('')

  // Update modal
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [catUpdateId, setCatUpdateId] = useState('')
  const [updateName, setUpdateName] = useState('')
  const [updateParent, setUpdateParent] = useState('')

  // Confirms
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState(null)
  const [deleteTargetName, setDeleteTargetName] = useState('')

  const [confirmUpdateOpen, setConfirmUpdateOpen] = useState(false)

  const [adding, setAdding] = useState(false)
  const { token } = useAuthToken()

  // Fetch categories
  const fetchCategories = () => {
    setLoading(true)
    axios
      .get('https://agarwal.mrshakil.com/api/blog/category-tree/')
      .then(res => {
        setCategories(res.data)
        setLoading(false)
      })
      .catch(() => {
        toast.error('Failed to load categories')
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Flatten categories for <select> options
  const flatOptions = useMemo(() => {
    const out = []
    const walk = (arr, prefix = '') => {
      arr.forEach(c => {
        out.push({ id: c.id, name: prefix ? `${prefix} > ${c.name}` : c.name })
        if (c.subcategories?.length) {
          walk(c.subcategories, prefix ? `${prefix} > ${c.name}` : c.name)
        }
      })
    }
    walk(categories)
    return out
  }, [categories])

  // Create subcategory
  const handleCreateSubcategory = async () => {
    if (!subCategoryName.trim()) {
      toast.error('Subcategory name is required')
      return
    }
    setAdding(true)
    try {
      await axios.post(
        'https://agarwal.mrshakil.com/api/blog/blog-categories/',
        {
          name: subCategoryName,
          parent: selectedParent ? Number(selectedParent) : null
        },
        {
          headers: { Authorization: `Token ${token}` }
        }
      )
      toast.success('Subcategory created successfully')
      setSubCategoryName('')
      setSelectedParent('')
      setModalOpen(false)
      fetchCategories()
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to create subcategory'
      )
    } finally {
      setAdding(false)
    }
  }

  // Prepare for update (open modal with prefilled values)
  const openUpdateModal = ({ id, name, parentId }) => {
    setCatUpdateId(id)
    setUpdateName(name || '')
    setUpdateParent(parentId ? String(parentId) : '')
    setUpdateModalOpen(true)
  }

  // Ask confirmation then update
  const requestUpdateConfirm = () => {
    if (!updateName.trim()) {
      toast.error('Name is required')
      return
    }
    setConfirmUpdateOpen(true)
  }

  const doUpdate = async () => {
    setAdding(true)
    try {
      const payload = {
        name: updateName,
        parent: updateParent ? Number(updateParent) : null
      }
      await axios.patch(
        `https://agarwal.mrshakil.com/api/blog/blog-categories/${catUpdateId}/`,
        payload,
        {
          headers: { Authorization: `Token ${token}` }
        }
      )
      toast.success('Category updated successfully')
      setUpdateModalOpen(false)
      setUpdateName('')
      setUpdateParent('')
      fetchCategories()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update category')
    } finally {
      setAdding(false)
    }
  }

  // Delete with confirm
  const askDelete = ({ id, name }) => {
    setDeleteTargetId(id)
    setDeleteTargetName(name)
    setConfirmDeleteOpen(true)
  }

  const doDelete = async () => {
    if (!deleteTargetId) return
    try {
      await axios.delete(
        `https://agarwal.mrshakil.com/api/blog/blog-categories/${deleteTargetId}/`,
        {
          headers: { Authorization: `Token ${token}` }
        }
      )
      toast.success('Category deleted successfully!')
      // refresh full tree because children might shift
      fetchCategories()
    } catch (error) {
      toast.error('Failed to delete category!')
    } finally {
      setDeleteTargetId(null)
      setDeleteTargetName('')
    }
  }

  if (loading) {
    return (
      <p className='text-center mt-10 text-gray-600'>Loading categories...</p>
    )
  }

  return (
    <>
      <Toaster position='top-center' />
      <Topbar text='Dashboard' DashboardIcon={IoHomeOutline} />

      <section className='p-5 lg:p-10'>
        <div className='grid xl:grid-cols-8 gap-10 h-full'>
          {/* Create Subcategory Card */}
          <div className='xl:col-span-2'>
            <h4 className='font-semibold text-base mb-3 text-black/80'>
              # Create Sub Category
            </h4>
            <div
              onClick={() => setModalOpen(true)}
              className=' max-h-[25vh] min-h-[20vh] w-full border border-dashed border-gray-400 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100'
              title='Add Sub-category'
            >
              <FiPlus size={48} className='text-gray-600' />
              <span className='mt-2 font-medium text-sm text-gray-700'>
                Create Sub Category
              </span>
            </div>
          </div>

          {/* Tree View */}
          <div className='xl:col-span-6'>
            <h4 className='w-full font-semibold text-base mb-3 text-black/80'>
              # Category Tree
            </h4>
            {categories.length === 0 ? (
              <p>No categories found.</p>
            ) : (
              <CategoryTree
                nodes={categories}
                onEdit={openUpdateModal}
                onDelete={askDelete}
                parentId={null}
              />
            )}
          </div>
        </div>

        {/* Create Modal */}
        {modalOpen && (
          <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg p-6 w-96 shadow-lg'>
              <h3 className='text-lg font-bold mb-4 text-center text-[#1D204E]'>
                Create Sub Category
              </h3>
              <div className='space-y-4'>
                <input
                  type='text'
                  placeholder='Subcategory Name'
                  value={subCategoryName}
                  onChange={e => setSubCategoryName(e.target.value)}
                  className='w-full p-2 border border-black/10 rounded outline-none'
                />
                <select
                  value={selectedParent}
                  onChange={e => setSelectedParent(e.target.value)}
                  className='w-full p-2 border border-black/10 rounded outline-none'
                >
                  <option value=''>Select Parent Category (optional)</option>
                  {flatOptions.map(opt => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </select>
                <div className='flex justify-end gap-3 mt-6'>
                  <button
                    onClick={() => setModalOpen(false)}
                    className='px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 cursor-pointer'
                    disabled={adding}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateSubcategory}
                    disabled={adding}
                    className='cursor-pointer px-4 py-2 rounded bg-[#56B84A] text-white hover:bg-[#4aa540] disabled:opacity-50'
                  >
                    {adding ? 'Adding...' : 'Add Subcategory'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Update Modal */}
        {updateModalOpen && (
          <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg p-6 w-96 shadow-lg'>
              <h3 className='text-lg font-bold mb-4 text-center text-[#1D204E]'>
                Update Category/Subcategory
              </h3>
              <div className='space-y-4'>
                <input
                  type='text'
                  placeholder='Name'
                  value={updateName}
                  onChange={e => setUpdateName(e.target.value)}
                  className='w-full p-2 border border-black/10 rounded outline-none'
                />
                <select
                  value={updateParent}
                  onChange={e => setUpdateParent(e.target.value)}
                  className='w-full p-2 border border-black/10 rounded outline-none'
                >
                  <option value=''>Select Parent Category (optional)</option>
                  {flatOptions.map(opt => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </select>

                <div className='flex justify-end gap-3 mt-6'>
                  <button
                    onClick={() => setUpdateModalOpen(false)}
                    className='px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 cursor-pointer'
                    disabled={adding}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={requestUpdateConfirm}
                    disabled={adding}
                    className='cursor-pointer px-4 py-2 rounded bg-[#56B84A] text-white hover:bg-[#4aa540] disabled:opacity-50'
                  >
                    {adding ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Delete */}
        <ConfirmModal
          open={confirmDeleteOpen}
          onClose={() => setConfirmDeleteOpen(false)}
          onConfirm={doDelete}
          message={`Delete "${deleteTargetName}"?`}
          des={' This cannot be undone.'}
        />

        {/* Confirm Update */}
        <ConfirmModal
          open={confirmUpdateOpen}
          onClose={() => setConfirmUpdateOpen(false)}
          onConfirm={doUpdate}
          message={`Update "${updateName}" with selected parent?`}
        />
      </section>

      {/* manage job post */}
      <HomeManageJobs />

      {/* Recent blog posts */}
      <HomeBlogPosts />
    </>
  )
}
