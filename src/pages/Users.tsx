import MoreMenu from '../components/MoreMenu';
import { useEffect, useState,useMemo } from 'react';
import profile from '../assets/profile.png';
import { AiFillDelete, AiFillEdit, AiFillEye } from "react-icons/ai";

// Modal component for editing a user



const UserTable = () => {
  const [user, setUser] = useState([]);
  const [error, setError] = useState(null);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [editingUser, setEditingUser] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const token = localStorage.getItem('authToken');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
const [detailUser, setDetailUser] = useState(null);
const [totalPages, setTotalPages] = useState(1);
const [confirmOpen, setConfirmOpen] = useState(false);
const [userToToggle, setUserToToggle] = useState(null);
const [toggleAction, setToggleAction] = useState('');
const EditUserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState(user || {});

  // Sync formData when user changes (edit another user)
  useEffect(() => {
    setFormData(user || {});
  }, [user]);

  if (!user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Edit User</h2>

        <label className="block mb-2">
          Name:
          <input
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </label>

        <label className="block mb-2">
          Email:
          <input
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            type="email"
            className="border p-2 rounded w-full"
          />
        </label>

        <label className="block mb-2">
          Phone:
          <input
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </label>

        {/* Optionally add other editable fields */}

        <div className="flex justify-end space-x-4 mt-4">
          <button
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// After fetching users and storing in `user` state, implement a sorted array:
const sortedUsers = useMemo(() => {
  if (!user) return [];

  const usersCopy = [...user];
  usersCopy.sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    // Handle undefined values
    if (valA === undefined) valA = '';
    if (valB === undefined) valB = '';

    // For booleans (e.g., is_verified), convert to 0/1
    if (typeof valA === 'boolean') valA = valA ? 1 : 0;
    if (typeof valB === 'boolean') valB = valB ? 1 : 0;

    // For dates or strings, convert to string lowercase for case-insensitive comparison
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return usersCopy;
}, [user, sortField, sortOrder]);
  const fetchUsers = () => {
    setLoading(true);
    let url = `/api/admin/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
    url += `&sortField=${sortField}&sortOrder=${sortOrder}`;

    fetch(url, {
      method: 'GET',
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
  setUser(data.data || data);
  setTotalPages(data.pagination?.totalPages || 1);
})
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit, search, sortField, sortOrder]);

  const handleSort = (fieldName) => {
    if (sortField === fieldName) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(fieldName);
      setSortOrder('asc');
    }
    setPage(1);
  };
const UserDetailModal = ({ user, onClose }) => {
  function formatDateForUI(dateString) {
  const date = new Date(dateString);
  // Format as DD/MM/YYYY
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

  if (!user) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">User Details</h2>

        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Phone:</b> {user.phone || 'N/A'}</p>
        <p><b>Verified:</b> {user.is_verified ? 'Yes' : 'No'}</p>
        <p><b>Created At:</b> {formatDateForUI(user.created_at)}</p>
        {/* Add more user fields here as needed */}

        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

  const renderSortArrow = (fieldName) => {
    if (sortField !== fieldName) return null;
    return sortOrder === 'asc' ? ' ▲' : ' ▼';
  };

  const toggleVerification = (user) => {
  const updatedUser = {
    is_verified: user.is_verified ? 0 : 1
  };
    fetch(`/api/admin/users/${user.id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedUser),
    })
      .then(res => {
        if (!res.ok) throw new Error(`Failed to update verification status`);
        return res.json();
      })
      .then(() => {
        fetchUsers();
      })
      .catch(err => {
        alert(err.message);
      });
  };

  const handleEditSave = (updatedUser) => {
    fetch(`/api/admin/users/${updatedUser.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedUser),
    })
      .then(res => {
        if (!res.ok) throw new Error(`Failed to update user: ${res.status}`);
        return res.json();
      })
      .then(() => {
        setEditModalOpen(false);
        setEditingUser(null);
        fetchUsers();
      })
      .catch(err => alert(err.message));
  };

  const handleDelete = (userToDelete) => {
     {
      fetch(`/api/admin/users/${userToDelete.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => {
          if (!res.ok) throw new Error(`Delete failed with status: ${res.status}`);
          fetchUsers();
        })
        .catch(err => alert(err.message));
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };
  const handlePrevPage = () => setPage(p => (p > 1 ? p - 1 : p));
  const handleNextPage = () => setPage(p => p + 1);

function formatDateForUI(dateString) {
  const date = new Date(dateString);
  // Format as DD/MM/YYYY
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}
const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
        <p className="mb-4 text-gray-700">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const handleConfirmToggle = () => {
  if (userToToggle) {
    toggleVerification(userToToggle); // call API to toggle
  }
  setConfirmOpen(false);
  setUserToToggle(null);
  setToggleAction('');
};

const handleCancelToggle = () => {
  setConfirmOpen(false);
  setUserToToggle(null);
  setToggleAction('');
};
  return (
<div className="px-2 md:px-6 bg-gray-50 min-h-screen">
    <div className="flex justify-between items-center mb-4  mx-auto">
        <h1 className="text-3xl font-bold">Users</h1>
        {/* <button onClick={() => navigate(`/add-product`)} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
          Add Product
        </button> */}
      </div>
  <div className="mx-auto  bg-white rounded-xl shadow pb-2">
        
        <div className="flex justify-between items-center px-6 py-4">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search user..."
            className="w-96 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button className="p-2 hover:bg-gray-100 rounded">
            {/* Filter icon */}
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              className="text-gray-400"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.618a2 2 0 01-.553 1.316l-6.64 7.42a2 2 0 00-.36 1.1V19a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3.546a2 2 0 00-.36-1.1l-6.639-7.42A2 2 0 013 6.618V4z"
              />
            </svg>
          </button>
        </div>

        {/* Data Table */}
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 text-gray-600 border-b">
              <th className="p-4 font-semibold text-left cursor-pointer">#</th>
              <th className="p-4 font-semibold text-left cursor-pointer" onClick={() => handleSort('name')}>
               
                <span className="ml-3">Name{renderSortArrow('name')}</span>
              </th>
              <th className="p-4 font-semibold text-left cursor-pointer" onClick={() => handleSort('email')}>
                Email{renderSortArrow('email')}
              </th>
              <th className="p-4 font-semibold text-left cursor-pointer" onClick={() => handleSort('phone')}>
                Phone{renderSortArrow('phone')}
              </th>
              <th className="p-4 font-semibold text-left cursor-pointer" onClick={() => handleSort('is_verified')}>
                Verified{renderSortArrow('is_verified')}
              </th>
              <th className="p-4 font-semibold text-left cursor-pointer" onClick={() => handleSort('created_at')}>
                Created At{renderSortArrow('created_at')}
              </th>
              <td className="p-4 font-semibold text-left cursor-pointer">Action</td>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-red-500">{error}</td>
              </tr>
            ) : user.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center">No users found.</td>
              </tr>
            ) : (
              sortedUsers.map((u,index) => (
                <tr key={u.id} className="hover:bg-gray-100">
                  <td className="p-4  items-center">{index+1}</td>
                  <td className="p-4 flex items-center">
                    <img
                      src={u.profile_pic || profile}
                      alt={u.name}
                      className="w-10 h-10 rounded-full mr-2"
                    />
                    <span className="ml-2">{u.name}</span>
                  </td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">{u.phone}</td>
            <td className="p-4 relative">
  <label className="inline-flex relative items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only peer"
      checked={u.is_verified}
      onChange={(e) => {
  e.preventDefault();
  setUserToToggle(u);
  setToggleAction(u.is_verified ? 'unverify' : 'verify');
  setConfirmOpen(true);
}}

    />
    <div className="w-11 h-6 bg-gray-200 rounded-full peer-focus:ring-4 peer-focus:ring-blue-300
           peer-checked:bg-blue-600 transition-colors"></div>
    <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow 
           peer-checked:translate-x-full peer-checked:border-blue-600 transition-transform border"></div>
  </label>
</td>

                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-lg text-sm font-semibold`}>
                     {formatDateForUI(`${u.created_at}`)}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
  onClick={() => {
    setDetailUser(u);
    setDetailModalOpen(true);
  }}
  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-gray-700 mr-2"
  aria-label="View user details"
>
<AiFillEye size={20} />
</button>
                    <button
                      onClick={() => {
                        setEditingUser(u);
                        setEditModalOpen(true);
                      }}
                      className="bg-blue-600 text-white px-3 py-1 mr-2 rounded hover:bg-blue-700 transition"
                      aria-label="Edit user"
                    >
                      <AiFillEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(u)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      aria-label="Delete user"
                    >
                      <AiFillDelete size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination controls */}
        <div className="flex justify-end space-x-2 px-6 py-4">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <button
  onClick={handleNextPage}
  disabled={page >= totalPages}
  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
>
  Next
</button>
        </div>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <EditUserModal
          user={editingUser}
          onClose={() => {
            setEditModalOpen(false);
            setEditingUser(null);
          }}
          onSave={handleEditSave}
        />
      )}
      {detailModalOpen && (
  <UserDetailModal
    user={detailUser}
    onClose={() => {
      setDetailModalOpen(false);
      setDetailUser(null);
    }}
  />
)}
<ConfirmModal
  isOpen={confirmOpen}
  message={`Are you sure you want to ${toggleAction} this user?`}
  onConfirm={handleConfirmToggle}
  onCancel={handleCancelToggle}
/>

    </div>
  );
};

export default UserTable;
