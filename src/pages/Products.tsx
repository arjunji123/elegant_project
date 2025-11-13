import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProduct } from '@/context/ProductContext';
import { AiFillDelete, AiFillEdit, AiFillEye } from 'react-icons/ai';

const ProductRow = ({ product, onEdit, onDelete, onView }) => {
  const imageUrl = product.images?.[0] || 'https://via.placeholder.com/100?text=No+Image';
  return (
    <tr className="border-b">
      <td className="p-2 flex justify-center items-center">
        <img
          src={imageUrl}
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
        <button onClick={() => onEdit(product)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition" title="Edit">
          <AiFillEdit size={20} />
        </button>
        <button onClick={() => onDelete(product)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition" title="Delete">
          <AiFillDelete size={20} />
        </button>
      </td>
    </tr>
  );
};

const ProductFormModal = ({ product = null, categories, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || '',
    category_id: product?.category_id || '',
    subcategory_id: product?.subcategory_id || '',
    images: product?.images || [],
    stock: product?.stock || '',
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useProduct();

  useEffect(() => {
    setFormData({
      name: product?.name || '',
      price: product?.price || '',
      category_id: product?.category_id || '',
      subcategory_id: product?.subcategory_id || '',
      images: product?.images || [],
      stock: product?.stock || '',
    });
    setImageFiles([]);
    setError(null);
  }, [product]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = e => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('price', formData.price);
      payload.append('category_id', formData.category_id);
      payload.append('subcategory_id', formData.subcategory_id);
      payload.append('stock', formData.stock);
      imageFiles.forEach((file, idx) => payload.append(`images[${idx}]`, file));

      const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products';
      const method = product ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      if (!res.ok) throw new Error(`Failed to ${product ? 'update' : 'create'} product`);

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
      <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg">
        <h2 className="text-xl font-semibold mb-4">{product ? 'Edit' : 'Add'} Product</h2>
        {error && <p className="text-red-600 mb-3">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">Name</label>
          <input name="name" value={formData.name} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 mb-4" />
          <label className="block mb-2 font-medium">Price</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 mb-4" />
          <label className="block mb-2 font-medium">Category</label>
          <select name="category_id" value={formData.category_id} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 mb-4">
            <option value="">Select category</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name || cat.category_name}</option>)}
          </select>
          <label className="block mb-2 font-medium">Subcategory</label>
          <input name="subcategory_id" value={formData.subcategory_id} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 mb-4" />
          <label className="block mb-2 font-medium">Stock</label>
          <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 mb-4" />
          <label className="block mb-2 font-medium">Upload Images</label>
          <input type="file" multiple onChange={handleImageChange} className="mb-4" />
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} disabled={loading} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
            <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

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
          <p><b>Stock:</b> {product.stock}</p>
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

  const openAddModal = () => {
    setEditProduct(null);
    setShowModal(true);
  };

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

  if (loading && products.length === 0) return <div>Loading products...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!products.length) return <div>No products found.</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold">Products</h1>
        <button onClick={openAddModal} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
          Add Product
        </button>
      </div>
      <div className="overflow-x-auto max-w-7xl mx-auto bg-white rounded shadow-md">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 text-gray-700 border-b-2 border-gray-200">
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Category</th>
              <th className="p-3">Subcategory</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <ProductRow
                key={product.id || product._id}
                product={product}
                onEdit={() => openEditModal(product)}
                onDelete={() => openDeleteConfirm(product)}
                onView={() => openDetailModal(product)}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="max-w-7xl mx-auto flex justify-center space-x-2 py-4">
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
