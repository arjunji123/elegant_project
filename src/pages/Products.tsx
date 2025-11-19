import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProduct } from '@/context/ProductContext';
import { AiFillDelete, AiFillEdit, AiFillEye } from 'react-icons/ai';
// import { platform } from 'os'; // platform import is unnecessary here

// ProductRow Component Definition (Updated for correct indexing)
const ProductRow = ({ product, onEdit, onDelete, onView, index, startIndex }) => {
//                                                                ^^^^^^^^^^^ <-- New prop added
    const navigate = useNavigate();
    return (
        <tr className="border-b">
            {/* Serial Number Calculation: (Page Start Index) + (Current Row Index) + 1 */}
            <td className="p-2 justify-center items-center">{startIndex + index + 1}</td> 
            <td className="p-2 flex justify-center items-center">
                <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                    onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/100?text=Image+Load+Error'; }}
                />
            </td>
            <td className="p-2 flex-col justify-center text-center">{product.name}</td>
            <td className="p-2 flex-col justify-center text-center text-indigo-600 font-semibold">{product.price}</td>
            <td className="p-2 flex-col justify-center text-center">{product.category && product.category.name}</td>
            <td className="p-2 flex-col justify-center text-center">{product.subcategory && product.subcategory.name}</td>
            <td className="p-2 flex justify-center items-center space-x-2">
                <button onClick={() => onView(product)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition" title="View">
                    <AiFillEye size={20} />
                </button>
                <button onClick={() => navigate(`/products/edit/${product.id}`)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition" title="Edit">
                    <AiFillEdit size={20} />
                </button>
                <button onClick={() => onDelete(product)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition" title="Delete">
                    <AiFillDelete size={20} />
                </button>
            </td>
        </tr>
    );
};

// ProductFormModal Component (Image logic, color mapping, and form state)
const ProductFormModal = ({ product, categories, onClose, onSave }) => {
    const [values, setValues] = useState({
        subcategory_id: '',
        name: '',
        description: '',
        category_id: '',
        unit: '',
        price: '',
        offer: '',
        colors: [{ name: '', code: '#000000' }],
        sizes: [''],
        images: [], // existing image URLs
    });
    // Array of File objects selected for upload
    const [imageFiles, setImageFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [existingImages, setExistingImages] = useState([]); // Added state to manage existing URLs
    const token = useProduct().token || localStorage.getItem('authToken');

    // Utility function to convert URL to File/Blob (Workaround for no backend access)
    const convertUrlToFile = async (url, originalFilename) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const filename = originalFilename || url.substring(url.lastIndexOf('/') + 1);
        return new File([blob], filename, { type: blob.type });
    };

    useEffect(() => {
        if (product) {
            // Apply necessary mapping for color keys if backend uses 'color_name'/'color_code'
            const formattedColors = (product.colors && product.colors.length > 0)
                ? product.colors.map(c => ({
                    name: c.name || c.color_name || '',
                    code: c.code || c.color_code || '#000000'
                }))
                : [{ name: '', code: '#000000' }];

            setValues({
                subcategory_id: product.subcategory_id || '',
                name: product.name || '',
                description: product.description || '',
                category_id: product.category_id || '',
                unit: product.unit || '',
                price: product.price || '',
                offer: product.offer || '',
                colors: formattedColors,
                sizes: product.sizes && product.sizes.length > 0 ? product.sizes : [''],
                images: product.images || [], // Initial list of URLs
            });
            setExistingImages(product.images || []); // Keep track of existing URLs separately
            setImageFiles([]);
            setError(null);
        }
    }, [product]);

    // Generic input change handler
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    // Colors handlers (omitted for brevity, assume they are correct)
    const handleColorChange = (index, field, value) => {
        const updatedColors = [...values.colors];
        updatedColors[index] = { ...updatedColors[index], [field]: value };
        setValues((prev) => ({ ...prev, colors: updatedColors }));
    };

    const addColorField = () => {
        setValues((prev) => ({ ...prev, colors: [...prev.colors, { name: '', code: '#000000' }] }));
    };

    const removeColorField = (index) => {
        setValues((prev) => ({ ...prev, colors: prev.colors.filter((_, i) => i !== index) }));
    };

    // Sizes handlers (omitted for brevity, assume they are correct)
    const handleSizeChange = (index, value) => {
        const updatedSizes = [...values.sizes];
        updatedSizes[index] = value;
        setValues((prev) => ({ ...prev, sizes: updatedSizes }));
    };

    const addSizeField = () => {
        setValues((prev) => ({ ...prev, sizes: [...prev.sizes, ''] }));
    };

    const removeSizeField = (index) => {
        setValues((prev) => ({ ...prev, sizes: prev.sizes.filter((_, i) => i !== index) }));
    };

    // File input handlers
    const handleImageFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (existingImages.length + imageFiles.length + files.length > 5) {
            alert('You can only have up to 5 images total.');
            return;
        }
        setImageFiles((prev) => [...prev, ...files]);
    };

    const removeImageFile = (index) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
    };
    
    // Handler to remove an existing image URL
    const removeExistingImage = (urlToRemove) => {
        setExistingImages((prev) => prev.filter(url => url !== urlToRemove));
    };

    // Submission handler with FormData (Using the workaround from previous turn)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();

            // 1. Convert ALL existing URLs into File objects
            const existingFilePromises = existingImages.map(url => convertUrlToFile(url));
            const existingFileBlobs = await Promise.all(existingFilePromises);

            // 2. Combine all images (newly selected files + converted existing files)
            const allFilesToSend = [...existingFileBlobs, ...imageFiles];

            // 3. Append ALL images as files to 'images' key
            allFilesToSend.forEach(file => formData.append('images', file));

            // --- Other Fields ---
            formData.append('subcategory_id', values.subcategory_id);
            formData.append('name', values.name);
            formData.append('description', values.description);
            formData.append('category_id', values.category_id);
            formData.append('unit', values.unit);
            formData.append('price', values.price);
            formData.append('offer', values.offer || '');

            formData.append(
                'colors',
                JSON.stringify(values.colors.filter(c => (c.name ?? '').trim() !== '' && (c.code ?? '').trim() !== ''))
            );
            formData.append(
                'sizes',
                JSON.stringify(values.sizes.filter(s => (s ?? '').trim() !== ''))
            );

            const url = `/api/admin/products/${product.id}`;
            const res = await fetch(url, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Do NOT set Content-Type header with FormData
                },
                body: formData,
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to update product: ${errorText}`);
            }

            onSave();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg overflow-auto max-h-[90vh]">
                <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
                {error && <p className="text-red-600 mb-3">{error}</p>}
                <form onSubmit={handleSubmit}>
                    {/* Category selector */}
                    <label className="block mb-2 font-medium">Category</label>
                    <select
                        name="category_id"
                        value={values.category_id}
                        onChange={handleChange}
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

                    {/* Subcategory input */}
                    <label className="block mb-2 font-medium">Subcategory</label>
                    <input
                        name="subcategory_id"
                        value={values.subcategory_id}
                        onChange={handleChange}
                        className="w-full mb-4 border border-gray-300 rounded-lg px-3 py-2"
                    />

                    {/* Name input */}
                    <label className="block mb-2 font-medium">Product Name</label>
                    <input
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        className="w-full mb-4 border border-gray-300 rounded-lg px-3 py-2"
                    />

                    {/* Description textarea */}
                    <label className="block mb-2 font-medium">Description</label>
                    <textarea
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full mb-4 border border-gray-300 rounded-lg px-3 py-2"
                    />

                    {/* Unit input */}
                    <label className="block mb-2 font-medium">Unit (e.g. ₹)</label>
                    <input
                        name="unit"
                        value={values.unit}
                        onChange={handleChange}
                        required
                        className="w-full mb-4 border border-gray-300 rounded-lg px-3 py-2"
                    />

                    {/* Price input */}
                    <label className="block mb-2 font-medium">Price</label>
                    <input
                        name="price"
                        type="number"
                        step="0.01"
                        value={values.price}
                        onChange={handleChange}
                        required
                        className="w-full mb-4 border border-gray-300 rounded-lg px-3 py-2"
                    />

                    {/* Offer input */}
                    <label className="block mb-2 font-medium">Offer (%)</label>
                    <input
                        name="offer"
                        type="number"
                        value={values.offer}
                        onChange={handleChange}
                        className="w-full mb-4 border border-gray-300 rounded-lg px-3 py-2"
                    />

                    {/* Colors section (Omitted) */}
                    <label className="block mb-2 font-medium">Colors</label>
                    {values.colors.map((color, idx) => (
                        <div key={idx} className="flex items-center mb-2 gap-2">
                            <input
                                type="text"
                                placeholder={`Color Name ${idx + 1}`}
                                value={color.name}
                                onChange={(e) => handleColorChange(idx, 'name', e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-3 py-2"
                                required
                            />
                            <input
                                type="color"
                                value={color.code}
                                onChange={(e) => handleColorChange(idx, 'code', e.target.value)}
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

                    {/* Sizes section (Omitted) */}
                    <label className="block mb-2 font-medium">Sizes</label>
                    {values.sizes.map((size, idx) => (
                        <div key={idx} className="flex items-center mb-2 gap-2">
                            <input
                                type="text"
                                placeholder={`Size ${idx + 1}`}
                                value={size}
                                onChange={(e) => handleSizeChange(idx, e.target.value)}
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

                    {/* Images input */}
                    <label className="block mb-2 font-medium">Upload Images (max 5)</label>
                    {/* Display Existing Images */}
                    <div className="flex flex-wrap gap-2 mb-2">
                        {existingImages.map((url, idx) => (
                            <div key={`existing-${idx}`} className="relative">
                                <img
                                    src={url}
                                    alt={`Existing ${idx + 1}`}
                                    className="w-20 h-20 object-cover rounded border"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeExistingImage(url)}
                                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>

                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="mb-4"
                    />
                    <div className="flex flex-wrap gap-2 mb-4">
                        {/* Display New File Previews */}
                        {imageFiles.map((file, idx) => (
                            <div key={`new-${idx}`} className="relative">
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

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || existingImages.length + imageFiles.length === 0}
                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// DeleteConfirmationModal Component (Omitted for brevity)
const DeleteConfirmationModal = ({ product, onCancel, onConfirm, loading }) => (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-sm w-full shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete "{product.name}"?</p>
            <div className="flex justify-end space-x-3">
                <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" disabled={loading}>Cancel</button>
                <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</button>
            </div>
        </div>
    </div>
);

// ProductDetailModal Component (Omitted for brevity)
const ProductDetailModal = ({ product, onClose }) => {
    if (!product) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg overflow-y-auto max-h-[80vh]">
                <h2 className="text-xl font-semibold mb-4">{product.name} Details</h2>
                <div className="flex overflow-x-scroll space-x-4 mb-4">
                    {(product.images && product.images.length > 0 ? product.images : ['https://via.placeholder.com/200']).map((img, idx) => (
                        <img key={idx} src={img} alt={`${product.name} ${idx + 1}`} className="w-24 h-24 object-cover rounded border" onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/100?text=Image+Load+Error'; }} />
                    ))}
                </div>
                <div>
                    <p><b>Name:</b> {product.name}</p>
                    <p><b>Description:</b> {product.description || 'N/A'}</p>
                    <p><b>Price:</b> {product.price}</p>
                    <p><b>Unit:</b> {product.unit}</p>
                    <p><b>Offer:</b> {product.offer || 'None'}</p>
                    <p><b>Category:</b> {product.category?.name || 'Uncategorized'}</p>
                    <p><b>Subcategory:</b> {product.subcategory?.name || 'N/A'}</p>
                </div>
                <div className="mt-6 text-right">
                    <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Close</button>
                </div>
            </div>
        </div>
    );
};

// ProductGrid Component (Updated to calculate startIndex)
const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [deleteProduct, setDeleteProduct] = useState(null);
    const [limit] = useState(10);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [detailProduct, setDetailProduct] = useState(null);
    const token = localStorage.getItem('authToken');
    const navigate = useNavigate();

    // Fetch categories
    useEffect(() => {
        fetch('/api/categories', {
            headers: { 'Content-Type': 'application/json' },
        })
            .then(res => res.json())
            .then(data => setCategories(data.data || data))
            .catch(() => setCategories([]));
    }, []);

    const loadProducts = () => {
        setLoading(true);
        fetch(`/api/admin/products?page=${page}&limit=${limit}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                setProducts(data.data || []);
                setTotalPages(data.pagination?.totalPages || 1);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadProducts();
    }, [page]);

    const handlePrev = () => setPage(p => Math.max(p - 1, 1));
    const handleNext = () => setPage(p => Math.min(p + 1, totalPages));

    const openEditModal = (product) => {
        setEditProduct(product);
        setShowModal(true);
    };

    const closeModal = () => {
        setEditProduct(null);
        setShowModal(false);
    };

    const openDeleteConfirm = (product) => {
        setDeleteProduct(product);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setDeleteProduct(null);
        setShowDeleteModal(false);
    };

    const handleSaveProduct = () => {
        loadProducts();
    };

    const handleDeleteProduct = async () => {
        if (!deleteProduct) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/products/${deleteProduct.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to delete product');
            closeDeleteModal();
            loadProducts();
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const openDetailModal = (product) => {
        setDetailProduct(product);
        setShowDetailModal(true);
    };

    const closeDetailModal = () => {
        setDetailProduct(null);
        setShowDetailModal(false);
    };

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    // --- CRITICAL CHANGE: Calculate the starting index for the current page ---
    const startIndex = (page - 1) * limit;
    // -------------------------------------------------------------------------

    if (loading && products.length === 0) return <div>Loading products...</div>;
    if (error) return <div className="text-red-600">{error}</div>;
    if (!products.length) return <div>No products found.</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-4 mx-auto">
                <h1 className="text-3xl font-bold">Products</h1>
                <button onClick={() => navigate(`/products/add`)} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
                    Add Product
                </button>
            </div>
            <div className="overflow-x-auto mx-auto bg-white rounded shadow-md">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 border-b-2 border-gray-200">
                            <th className="p-3">#</th>
                            <th className="p-3">Image</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Subcategory</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <ProductRow
                                key={product.id || product._id}
                                product={product}
                                onEdit={() => openEditModal(product)}
                                onDelete={() => openDeleteConfirm(product)}
                                onView={() => openDetailModal(product)}
                                index={index}
                                startIndex={startIndex} // Pass the calculated starting index
                            />
                        ))}
                    </tbody>
                </table>
            </div>
            <div className=" mx-auto flex justify-center space-x-2 py-4">
                <button onClick={handlePrev} disabled={page === 1} className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50">
                    Previous
                </button>
                {pageNumbers.map(pageNum => (
                    <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-4 py-2 rounded ${pageNum === page ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                        {pageNum}
                    </button>
                ))}
                <button onClick={handleNext} disabled={page === totalPages} className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50">
                    Next
                </button>
            </div>

            {showModal && (
                <ProductFormModal
                    product={editProduct}
                    categories={categories}
                    onClose={closeModal}
                    onSave={handleSaveProduct}
                />
            )}

            {showDeleteModal && deleteProduct && (
                <DeleteConfirmationModal
                    product={deleteProduct}
                    onCancel={closeDeleteModal}
                    onConfirm={handleDeleteProduct}
                    loading={loading}
                />
            )}

            {showDetailModal && detailProduct && (
                <ProductDetailModal product={detailProduct} onClose={closeDetailModal} />
            )}
        </div>
    );
};

export default ProductGrid;