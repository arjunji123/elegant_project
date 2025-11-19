import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const defaultValues = {
  subcategory_id: '',
  name: '',
  description: '',
  category_id: '',
  unit: '',
  price: '',
  offer: '',
  colors: [{ name: '', code: '#000000' }],
  sizes: [''],
  images: [],
};

const AddProductForm = ({ onSuccess }) => {
  const [values, setValues] = useState(defaultValues);
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesID, setCategoriesID] = useState('');
  
  const token = localStorage.getItem('authToken');
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(productId);

  // Fetch categories
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.data || data))
      .catch(() => setCategories([]));
  }, []);

  // --- FIX 1: Fetch product details (Handle Nulls) ---
  useEffect(() => {
    if (!isEditMode) return;

    setLoading(true);
    fetch(`/api/admin/products/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        const p = data.data;

        // We use || '' (OR empty string) to ensure we never set state to null.
        // This fixes the "controlled input" warning.
        setValues({
          subcategory_id: p.subcategory_id || '',
          name: p.name || '',
          description: p.description || '',
          category_id: p.category_id || '',
          unit: p.unit || '',
          price: p.price || '',
          offer: p.offer || '',
          // Ensure arrays are valid arrays
          colors: (p.colors && p.colors.length > 0) ? p.colors : [{ name: '', code: '#000000' }],
          sizes: (p.sizes && p.sizes.length > 0) ? p.sizes : [''],
          images: p.images || [],
        });

        setExistingImages(p.images || []);
        setCategoriesID(p.category_id || '');
      })
      .finally(() => setLoading(false));
  }, [productId, isEditMode, token]);

  // Fetch subcategories when category changes
  useEffect(() => {
    const catId = categoriesID || values.category_id;
    if (!catId) {
      setSubcategories([]);
      return;
    }
    const url = `/api/Categories/${catId}/subcategories`;
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.data)) {
          setSubcategories(data.data.length > 0 ? data.data : []);
        } else {
          setSubcategories([]);
        }
      })
      .catch(() => setSubcategories([]));
  }, [categoriesID, values.category_id, token]);

  // --- Handlers ---

  const handleCategoryChange = e => {
    const selectedCategoryId = e.target.value;
    setCategoriesID(selectedCategoryId);
    setValues(prev => ({
      ...prev,
      category_id: selectedCategoryId,
      subcategory_id: '',
    }));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (index, field, value) => {
    const updatedColors = [...values.colors];
    updatedColors[index] = { ...updatedColors[index], [field]: value };
    setValues(prev => ({ ...prev, colors: updatedColors }));
  };

  const addColorField = () =>
    setValues(prev => ({
      ...prev,
      colors: [...prev.colors, { name: '', code: '#000000' }],
    }));

  const removeColorField = index =>
    setValues(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));

  const handleSizeChange = (index, value) => {
    const updatedSizes = [...values.sizes];
    updatedSizes[index] = value;
    setValues(prev => ({ ...prev, sizes: updatedSizes }));
  };

  const addSizeField = () =>
    setValues(prev => ({ ...prev, sizes: [...prev.sizes, ''] }));

  const removeSizeField = index =>
    setValues(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));

  const handleImageFileChange = e => {
    const files = Array.from(e.target.files);
    if (imageFiles.length + existingImages.length + files.length > 5) {
      alert('You can upload max 5 images');
      return;
    }
    setImageFiles(prev => [...prev, ...files]);
  };

  const removeExistingImage = index => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeImageFile = index => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    const formData = new FormData();

    // --- Basic Fields ---
    formData.append('subcategory_id', values.subcategory_id);
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('category_id', values.category_id);
    formData.append('unit', values.unit);
    formData.append('price', values.price.toString());
    
    // Arrays to JSON strings
    formData.append('colors', JSON.stringify(values.colors));
    formData.append('sizes', JSON.stringify(values.sizes));

    // --- CRITICAL CHANGE HERE ---
    
    // 1. Append New Files to 'images'
    imageFiles.forEach((file) => {
      formData.append('images', file); 
    });

    // 2. Append Existing URLs to 'images' (SAME KEY)
    existingImages.forEach((url) => {
      formData.append('images', url);
    });

    // Debugging: Let's see what is inside
    console.log("--- Sending Form Data ---");
    for (const pair of formData.entries()) {
        // Check if it's a file or string to log clearly
        if (pair[1] instanceof File) {
            console.log(`${pair[0]}: File - ${pair[1].name}`);
        } else {
            console.log(`${pair[0]}: ${pair[1]}`);
        }
    }

    const apiURL = isEditMode
      ? `/api/admin/products/${productId}`
      : `/api/product`;
    const method = isEditMode ? 'PUT' : 'POST';

    const response = await fetch(apiURL, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    setSuccess(true);
    if (onSuccess) onSuccess();
    navigate('/products');
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 mx-auto mt-8">
      <button
        type="button"
        onClick={() => navigate('/products')}
        className="mb-6 flex items-center text-gray-700 hover:text-indigo-700"
      >
        <span className="mr-2">&#8592;</span>
        Back to List
      </button>

      <h2 className="text-2xl font-semibold mb-6 text-center">{isEditMode ? "Edit Product" : "Add Product"}</h2>
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
        {Array.isArray(subcategories) ? (
          subcategories.map(sub => (
            <option key={sub.id} value={sub.id}>
              {sub.name || sub.subcategory_name}
            </option>
          ))
        ) : (
          <option value="" disabled>{typeof subcategories === 'string' ? subcategories : ''}</option>
        )}
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
      {/* Existing Images Preview */}
      {existingImages.length > 0 && (
        <div className="mb-4">
          <label className="block mb-2 font-medium">Existing Images</label>
          <div className="flex flex-wrap gap-2">
            {existingImages.map((img, idx) => (
              <div key={idx} className="relative">
                <img
                  src={img} // Existing image URL
                  alt={`Existing ${idx + 1}`}
                  className="w-20 h-20 object-cover rounded border"
                />

                {/* Remove existing image */}
                <button
                  type="button"
                  onClick={() => removeExistingImage(idx)}
                  className="absolute top-0 right-0 bg-red-600 text-white 
                          rounded-full w-5 h-5 flex items-center 
                          justify-center cursor-pointer"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
        {loading ? 'Saving...' : isEditMode ? 'Update Product' : 'Add Product'}      </button>
    </form>
  );
};

export default AddProductForm;