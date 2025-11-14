import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';

const defaultValues = {
    subcategory_id: '',
    name: '',
    description: '',
    category_id: '',
    unit: '',
    price: '',
    offer: '',
    images: ['']
};

const EditSubcategoryModal = ({ subcategory, categories, onClose, onSaved }) => {
    const [formData, setFormData] = useState(subcategory || {});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
const token = localStorage.getItem('authToken');
    useEffect(() => {
        setFormData(subcategory || {});
        setError(null);
    }, [subcategory]);

    if (!subcategory) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Convert category_id to number if necessary
        const payload = {
            ...formData,
            category_id: Number(formData.category_id),
        };

        try {
            const res = await fetch(`/api/admin/subcategories/${subcategory.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,

                },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Failed to update subcategory');
            onSaved();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Edit Subcategory</h2>
                {error && <p className="text-red-600 mb-3">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label className="block mb-2 font-medium">Name</label>
                    <input
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                        required
                    />

                    <label className="block mb-2 font-medium">Description</label>
                    <textarea
                        name="description"
                        value={formData.description || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                        rows={3}
                    />

                    <label className="block mb-2 font-medium">Parent Category</label>
                    <select
                        name="category_id"
                        value={formData.category_id || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name || cat.category_name}
                            </option>
                        ))}
                    </select>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            disabled={loading}
                            onClick={onClose}
                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};




export const SubcategoriesList = () => {
    // State...
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
const token = localStorage.getItem('authToken');

    const navigate = useNavigate();

    // Load categories and paginated subcategories
    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data.data || data))
            .catch(() => setCategories([]));
    }, []);

    const fetchSubcategories = () => {
 setLoading(true);
        fetch(`/api/admin/subcategories?page=${page}&limit=${pagination.limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,

            },
        })
            .then(res => res.json())
            .then(data => {
                setSubcategories(data.data || []);
                setPagination(data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
            })
            .catch(() => setSubcategories([]))
            .finally(() => setLoading(false));
    }
    useEffect(() => {
       fetchSubcategories();
    }, [page]);

    // Refresh list helper
    const refreshList = () => {
        setPage(1);
    };

    // Delete handler
    const handleDelete = async () => {
        if (!selectedSubcategory) return;
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/subcategories/${selectedSubcategory.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error('Failed to delete subcategory');
            setDeleteModalOpen(false);
            setSelectedSubcategory(null);
            fetchSubcategories();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Open modals
    const openEditModal = (sub) => {
        setSelectedSubcategory(sub);
        setEditModalOpen(true);
        refreshList();

    };

    const closeEditModal = () => {
        setSelectedSubcategory(null);
        setEditModalOpen(false);
        fetchSubcategories();

    };

    const openDeleteModal = (sub) => {
        setSelectedSubcategory(sub);
        setDeleteModalOpen(true);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Subcategory Management List</h1>
                <button
                    onClick={() => navigate(`/add-sub-categories`)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                    + Add New Subcategory
                </button>
            </div>

            {loading && <p>Loading...</p>}

            {!loading && (
                <>
                    <table className="min-w-full bg-white shadow rounded-lg">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 border-b-2">
                                <th className="p-4 text-left w-2/5">Subcategory Name</th>
                                <th className="p-4 text-left w-1/5">Parent Category</th>
                                <th className="p-4 text-left w-1/10">ID</th>
                                <th className="p-4 text-center w-1/5">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subcategories.map(sub => (
                                <tr key={sub.id} className="hover:bg-gray-100 border-b">
                                    <td className="p-4 font-medium text-gray-800">{sub.name}</td>
                                    <td className="p-4 text-indigo-600 font-semibold">{sub.category?.name}</td>
                                    <td className="p-4 text-gray-600">{sub.id}</td>
                                    <td className="p-4 text-center space-x-4">
                                        <button
                                            onClick={() => openEditModal(sub)}
                                            className="text-blue-600 hover:text-blue-800"
                                            aria-label="Edit subcategory"
                                        >
                                            <AiFillEdit size={20} />
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(sub)}
                                            className="text-red-600 hover:text-red-800"
                                            aria-label="Delete subcategory"
                                        >
                                            <AiFillDelete size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination controls */}
                    <div className="flex justify-center my-6 space-x-3">
                        <button
                            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Previous
                        </button>
                        {Array.from({ length: pagination.totalPages || 1 }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setPage(i + 1)}
                                className={`px-4 py-2 rounded ${page === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setPage(prev => Math.min(prev + 1, pagination.totalPages))}
                            disabled={page === pagination.totalPages}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}

            {/* Edit Modal */}
            {editModalOpen && selectedSubcategory && (
                <EditSubcategoryModal
                    subcategory={selectedSubcategory}
                    categories={categories}
                    onClose={closeEditModal}
                    onSaved={refreshList}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && selectedSubcategory && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-sm w-full shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
                        <p className="mb-4">
                            Are you sure you want to delete "<strong>{selectedSubcategory.name}</strong>"?
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


export const AddSubcategories = () => {
    const [values, setValues] = useState(defaultValues);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [subcategories, setSubcategories] = useState([]);
    const [description, setDescription] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoriesID, setCategoriesID] = useState([]);
const token = localStorage.getItem('authToken');

    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/categories') // Replace with your categories endpoint
            .then(res => res.json())
            .then(data => setCategories(data.data || data))
            .catch(() => setCategories([]));
    }, []);

    const handleCategoryChange = (e) => {
        const selectedCategoryId = e.target.value;
        setCategoriesID(selectedCategoryId); // your separate state for category id
        setValues(prev => ({ ...prev, category_id: selectedCategoryId, subcategory_id: '' })); // reset subcategory
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        setSuccess(false);
        try {
            const response = await fetch('/api/subcategories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization:`Bearer ${token}` ,
                },
                body: JSON.stringify({
                    ...values,
                    category_id: parseInt(categoriesID),
                    name: (subcategories),
                    description: description,
                }),
            });
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            setSuccess(true);
            setValues(defaultValues);
            navigate(`/sub-categories`)
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow-lg rounded-xl p-8 mx-auto mt-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">Add SubCategories</h2>
            {error && <div className="mb-4 text-red-600">{error}</div>}
            {success && (
                <div className="mb-4 text-green-600">SubCategories added successfully!</div>
            )}
            {/* Subcategory ID */}
            <label className="block mb-2 text-sm font-medium">SubCategories</label>
            <select
                name="category_id"
                value={values.category_id}
                onChange={handleCategoryChange}
                className="w-full mb-4 border border-gray-300 rounded-lg px-3 py-2"
                required
            >
                <option value="">Select category</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                        {cat.category_name || cat.name}
                    </option>
                ))}
            </select>

            <label className="block mb-2 text-sm font-medium">Sub Categories</label>
            <input
                name="category"
                value={subcategories}
                onChange={e => setSubcategories(e.target.value)}
                className="w-full mb-4 border border-gray-300 rounded-lg px-3 py-2"
                required
            />
            <label className="block mb-2 text-sm font-medium">Description</label>
            <input
                name="category"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full mb-4 border border-gray-300 rounded-lg px-3 py-2"
                required
            />


            <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition"
            >
                {loading ? 'Adding...' : 'Add subcategories'}
            </button>
        </form>
    );
};

