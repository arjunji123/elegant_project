import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { FiTrash } from 'react-icons/fi';

const defaultValues = {
  name: '',
  images: [''],
};

// Modal for editing category
const EditCategoryModal = ({ category, onClose, onSave }) => {
  const [values, setValues] = useState({
    name: '',
    description: '',
    images: [], // URLs
    icon: '',
    subcategory_ids: [],
  });
  const [iconFile, setIconFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!category) return;
    setValues({
      name: category.name || '',
      description: category.description || '',
      images: category.images ? [...category.images] : [],
      icon: category.icon || '',
      subcategory_ids: category.subcategory_ids || [],
    });
    setIconFile(null);
    setError(null);
  }, [category]);

  if (!category) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleIconChange = e => {
    const file = e.target.files[0];
    if (file) setIconFile(file);
  };

  // Add new image URL (replace with actual file upload in real scenario)
  const handleAddImage = e => {
    const file = e.target.files[0];
    if (!file) return;

    // For preview only, not uploaded
    const url = URL.createObjectURL(file);
    setValues(prev => ({ ...prev, images: [...prev.images, url] }));
  };

  const removeImage = idx => {
    if (window.confirm('Remove this image?')) {
      setValues(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== idx),
      }));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name: values.name,
      description: values.description,
      icon: values.icon, // Keep URL only
      images: values.images, // Only URLs, not File objects
      subcategory_ids: values.subcategory_ids,
    };

    fetch(`/api/admin/categories/${category.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then(res => {
        if (!res.ok) return res.text().then(text => { throw new Error(text || 'Failed to update category'); });
        return res.json();
      })
      .then(() => {
        onSave();
        onClose();
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg overflow-auto max-h-[80vh]">
        <h2 className="text-2xl mb-4 font-semibold">Edit Category</h2>
        {error && <p className="text-red-600 mb-3">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">Category Name</label>
          <input
            type="text"
            name="name"
            value={values.name || ''}
            onChange={handleChange}
            required
            className="mb-4 w-full border border-gray-300 rounded px-3 py-2"
          />

          <label className="block mb-2 font-medium">Description</label>
          <input
            type="text"
            name="description"
            value={values.description || ''}
            onChange={handleChange}
            className="mb-4 w-full border border-gray-300 rounded px-3 py-2"
          />

          <label className="block mb-2 font-medium">Category Icon</label>
          <div className="flex items-center mb-4 space-x-4">
            {iconFile ? (
              <img src={URL.createObjectURL(iconFile)} alt="Icon Preview" className="w-20 h-20 object-cover rounded border" />
            ) : values.icon ? (
              <img src={values.icon} alt="Current Icon" className="w-20 h-20 object-cover rounded border" />
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded border flex items-center justify-center text-gray-400">No Icon</div>
            )}
            <input type="file" accept="image/*" onChange={handleIconChange} className="border rounded p-1" />
          </div>

          <label className="block mb-2 font-medium">Images</label>
          <div className="flex flex-wrap gap-4 mb-4">
            {values.images.map((img, idx) => (
              <div key={idx} className="relative">
                <img src={img} alt={`Image ${idx + 1}`} className="w-20 h-20 object-cover rounded border" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 hover:bg-red-800"
                  aria-label="Remove image"
                >
                  <FiTrash size={12} />
                </button>
              </div>
            ))}
            <input type="file" accept="image/*" onChange={handleAddImage} className="border rounded p-1" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={onClose} disabled={loading} className="mt-2 w-full bg-gray-300 py-2 rounded hover:bg-gray-400 transition">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
const token = localStorage.getItem('authToken');

  useEffect(() => {
    fetch('/api/admin/categories',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
           `Bearer ${token}`,
        },
      }
    )
      .then(res => res.json())
      .then(data => setCategories(data.data || data))
      .catch(() => setCategories([]));
  }, []);

  // Refetch categories from server
  const refreshCategories = () => {
    fetch('/api/categories-with-subcategories')
      .then(res => res.json())
      .then(data => setCategories(data.data || data))
      .catch(() => setCategories([]));
  };

  // Delete category
  const handleDelete = async () => {
    if (!selectedCategory) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/categories/${selectedCategory.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to delete category');
      setCategories(prev => prev.filter(cat => cat.id !== selectedCategory.id));
      setDeleteModalOpen(false);
      setSelectedCategory(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Open Delete modal
  const openDeleteModal = category => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  // Open Edit modal
  const openEditModal = category => {
    setSelectedCategory(category);
    setEditModalOpen(true);
  };

  // Close Edit modal
  const closeEditModal = () => {
    setSelectedCategory(null);
    setEditModalOpen(false);
  };
  // After save, refresh list
  const handleEditSave = () => {
    refreshCategories();
  }

  const AddCategories = () => {
    console.log('Navigate to Add Categories');

    navigate(`/add-categories`)
  }
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6  mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-150"
          onClick={AddCategories}
        >
          Add Categories
        </button>
      </div>

      <table className="min-w-full bg-white shadow-lg rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-gray-700 border-b-2 border-gray-200">
            <th className="p-4 font-semibold text-left">Categories Name</th>
            <th className="p-4 font-semibold text-left">Categories ID</th>
            <th className="p-4 font-semibold text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(u => (
            <tr key={u.id} className="hover:bg-gray-100">
              <td className="p-4 flex items-center">
                <img
                  src={u.icon}
                  alt={u.name}
                  className="w-10 h-10 rounded-full mr-2"
                />
                <span className="ml-2">{u.name}</span>
              </td>
              <td className="p-4">{u.id}</td>
              <td className="p-4 text-center space-x-4">
                <button
                  onClick={() => openEditModal(u)}
                  className="text-blue-600 hover:text-blue-800"
                  aria-label="Edit category"
                >
                  <AiFillEdit size={20} />
                </button>

                <button
                  onClick={() => openDeleteModal(u)}
                  className="text-red-600 hover:text-red-800"
                  aria-label="Delete category"
                >
                  <AiFillDelete size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editModalOpen && selectedCategory && (
        <EditCategoryModal
          category={selectedCategory}
          onClose={closeEditModal}
          onSave={handleEditSave}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-4">
              Are you sure you want to delete "<strong>{selectedCategory.name}</strong>"?
            </p>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



export const AddCategories = () => {
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('authToken');
    const formDataToSend = new FormData();
    formDataToSend.append('name', category);
    formDataToSend.append('description', description);
    if (imageFile) formDataToSend.append('icon', imageFile);

    console.log('Form Data:', category, description, imageFile);

    try {
      const response = await fetch('api/categories', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,  // <-- no Content-Type here!
        },
        body: formDataToSend,
      });
      console.log('Response:', response);
      if (!response.ok) {
        throw new Error('Failed to add category');
      }

      // Reset form state on success
      setCategory('');
      setImageFile(null);
      setImagePreview(null);
      setDescription('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-xl p-8 mx-auto mt-8"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">Add Category</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}

      <label className="block mb-2 text-sm font-medium">Category Name</label>
      <input
        name="category"
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="w-full mb-4 border border-gray-300 rounded-lg px-3 py-2"
        required
      />

      <label className="block mb-2 text-sm font-medium">Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="w-full mb-4 border border-gray-300 rounded-lg px-3 py-2"
        required
      />
      {imagePreview && (
        <img src={imagePreview} alt="Preview" className="mb-4 w-full max-h-48 object-contain rounded-lg" />
      )}

      <label className="block mb-2 text-sm font-medium">Description</label>
      <textarea
        name="description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="w-full mb-4 border border-gray-300 rounded-lg px-3 py-2"
        rows={3}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        {loading ? 'Adding...' : 'Add Category'}
      </button>
    </form>
  );
};

