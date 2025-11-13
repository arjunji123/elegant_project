import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const defaultValues = {
  subcategory_id: '',
  name: '',
  description: '',
  category_id: '',
  unit: '',
  price: '',
  offer: '',
  colors: [{ name: '', code: '#000000' }], // color objects with name and code
  sizes: [''],
  images: [], // will hold URLs or file objects
};

const AddProductForm = ({ onSuccess }) => {
  const [values, setValues] = useState(defaultValues);
  const [imageFiles, setImageFiles] = useState([]); // for system file uploads
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesID, setCategoriesID] = useState('');
  const token = localStorage.getItem('authToken'); // or pass via context
  const navigate = useNavigate();

  // Fetch categories on mount
  useEffect(() => {
    fetch('/api/categories') // Replace with your categories endpoint
      .then(res => res.json())
      .then(data => setCategories(data.data || data))
      .catch(() => setCategories([]));
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (!categoriesID) {
      setSubcategories([]);
      setValues(v => ({ ...v, subcategory_id: '' }));
      return;
    }
    fetch(`api/Categories/${categoriesID}/subcategories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setSubcategories(data.data || []);
        setValues(v => ({ ...v, subcategory_id: '' }));
      })
      .catch(() => {
        setSubcategories([]);
        setValues(v => ({ ...v, subcategory_id: '' }));
      });
  }, [categoriesID, token]);

  const handleCategoryChange = e => {
    const selectedCategoryId = e.target.value;
    setCategoriesID(selectedCategoryId);
    setValues(prev => ({ ...prev, category_id: selectedCategoryId, subcategory_id: '' }));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  // Colors management (name and code)
  const handleColorChange = (index, field, value) => {
    const updatedColors = [...values.colors];
    updatedColors[index] = { ...updatedColors[index], [field]: value };
    setValues(prev => ({ ...prev, colors: updatedColors }));
  };

  const addColorField = () => {
    setValues(prev => ({ ...prev, colors: [...prev.colors, { name: '', code: '#000000' }] }));
  };

  const removeColorField = index => {
    setValues(prev => ({ ...prev, colors: prev.colors.filter((_, i) => i !== index) }));
  };

  // Sizes management (strings)
  const handleSizeChange = (index, value) => {
    const updatedSizes = [...values.sizes];
    updatedSizes[index] = value;
    setValues(prev => ({ ...prev, sizes: updatedSizes }));
  };

  const addSizeField = () => {
    setValues(prev => ({ ...prev, sizes: [...prev.sizes, ''] }));
  };

  const removeSizeField = index => {
    setValues(prev => ({ ...prev, sizes: prev.sizes.filter((_, i) => i !== index) }));
  };

  // Image file upload management (max 5)
  const handleImageFileChange = e => {
    const files = Array.from(e.target.files);
    const totalFiles = imageFiles.length + files.length;
    if (totalFiles > 5) {
      alert('You can only upload up to 5 images');
      return;
    }
    setImageFiles(prev => [...prev, ...files]);
  };

  const removeImageFile = index => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Submit handler using FormData
  const handleSubmit = e => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSuccess(false);

    const formData = new FormData();
    formData.append('subcategory_id', values.subcategory_id);
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('category_id', values.category_id);
    formData.append('unit', values.unit);
    formData.append('price', values.price); // send as string or parse if backend wants number
    formData.append('offer', values.offer || '');

    // Append colors as JSON string filtered for non-empty names and codes
    formData.append(
      'colors',
      JSON.stringify(values.colors.filter(c => c.name.trim() !== '' && c.code.trim() !== ''))
    );

    // Append sizes as JSON string filtered for non-empty
    formData.append('sizes', JSON.stringify(values.sizes.filter(s => s.trim() !== '')));

    // Append image files
    imageFiles.forEach(file => formData.append('images', file));

    fetch('/api/product', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type header; browser handles for FormData
      },
      body: formData,
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        setSuccess(true);
        setValues(defaultValues);
        setImageFiles([]);
        if (onSuccess){
onSuccess();
Navigate('/products');
        } 
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 mx-auto mt-8 max-w-3xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">Add Product</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {success && <div className="mb-4 text-green-600">Product added successfully!</div>}

      {/* Categories */}
      <label className="block mb-2 text-sm font-medium">Category</label>
      <select
        name="category_id"
        value={values.category_id}
        onChange={handleCategoryChange}
        required
        className="w-full mb-4 border border-gray-300 rounded-lg px-3 py-2"
      >
        <option value="">Select category</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>
            {cat.category_name || cat.name}
          </option>
        ))}
      </select>

      {/* Subcategories */}
      <label className="block mb-2 text-sm font-medium">Subcategory</label>
      <select
        name="subcategory_id"
        value={values.subcategory_id}
        onChange={handleChange}
        required
        disabled={!values.category_id}
        className="w-full mb-4 border border-gray-300 rounded-lg px-3 py-2"
      >
        <option value="">Select subcategory</option>
        {subcategories &&
          subcategories.map(sub => (
            <option key={sub.id} value={sub.id}>
              {sub.subcategory_name || sub.name}
            </option>
          ))}
      </select>

      {/* Name */}
      <label className="block mb-2 text-sm font-medium">Product Name</label>
      <input
        name="name"
        value={values.name}
        onChange={handleChange}
        required
        className="w-full mb-4 border border-gray-300 rounded-lg px-3 py-2"
      />

      {/* Description */}
      <label className="block mb-2 text-sm font-medium">Description</label>
      <textarea
        name="description"
        value={values.description}
        onChange={handleChange}
        required
        rows={3}
        className="w-full mb-4 border border-gray-300 rounded-lg px-3 py-2"
      />

      {/* Unit */}
      <label className="block mb-2 text-sm font-medium">Unit (e.g. ₹)</label>
      <input
        name="unit"
        value={values.unit}
        onChange={handleChange}
        required
        className="w-full mb-4 border border-gray-300 rounded-lg px-3 py-2"
      />

      {/* Price */}
      <label className="block mb-2 text-sm font-medium">Price</label>
      <input
        name="price"
        type="number"
        step="0.01"
        value={values.price}
        onChange={handleChange}
        required
        className="w-full mb-4 border border-gray-300 rounded-lg px-3 py-2"
      />

      {/* Offer */}
      <label className="block mb-2 text-sm font-medium">Offer (%)</label>
      <input
        name="offer"
        type="number"
        value={values.offer}
        onChange={handleChange}
        className="w-full mb-4 border border-gray-300 rounded-lg px-3 py-2"
      />

      {/* Colors */}
      <label className="block mb-2 font-medium">Colors</label>
      {values.colors.map((color, idx) => (
        <div key={idx} className="flex items-center mb-2 gap-2">
          <input
            type="text"
            placeholder={`Color Name ${idx + 1}`}
            value={color.name}
            onChange={e => handleColorChange(idx, 'name', e.target.value)}
            className="flex-1 border border-gray-300 rounded px-3 py-2"
            required
          />
          <input
            type="color"
            value={color.code}
            onChange={e => handleColorChange(idx, 'code', e.target.value)}
            className="w-12 h-12 p-0 border border-gray-300 rounded"
            required
          />
          {values.colors.length > 1 && (
            <button
              type="button"
              onClick={() => removeColorField(idx)}
              className="text-red-600 hover:text-red-800 font-bold px-2"
            >
              ×
            </button>
          )}
        </div>
      ))}
      {values.colors.length < 10 && (
        <button
          type="button"
          onClick={addColorField}
          className="mb-4 text-indigo-600 hover:underline text-sm"
        >
          + Add another color
        </button>
      )}

      {/* Sizes */}
      <label className="block mb-2 font-medium">Sizes</label>
      {values.sizes.map((size, idx) => (
        <div key={idx} className="flex items-center mb-2 gap-2">
          <input
            type="text"
            placeholder={`Size ${idx + 1}`}
            value={size}
            onChange={e => handleSizeChange(idx, e.target.value)}
            className="flex-1 border border-gray-300 rounded px-3 py-2"
          />
          {values.sizes.length > 1 && (
            <button
              type="button"
              onClick={() => removeSizeField(idx)}
              className="text-red-600 hover:text-red-800 font-bold px-2"
            >
              ×
            </button>
          )}
        </div>
      ))}
      {values.sizes.length < 10 && (
        <button
          type="button"
          onClick={addSizeField}
          className="mb-4 text-indigo-600 hover:underline text-sm"
        >
          + Add another size
        </button>
      )}

      {/* Image upload */}
      <label className="block mb-2 font-medium">Upload Images (max 5)</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageFileChange}
        className="mb-4"
      />
      <div className="flex flex-wrap gap-2 mb-4">
        {imageFiles.map((file, idx) => (
          <div key={idx} className="relative">
            <img
              src={URL.createObjectURL(file)}
              alt={`Preview ${idx + 1}`}
              className="w-20 h-20 object-cover rounded border"
            />
            <button
              type="button"
              onClick={() => removeImageFile(idx)}
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        {loading ? 'Adding...' : 'Add Product'}
      </button>
    </form>
  );
};

export default AddProductForm;
