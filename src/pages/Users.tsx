import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import profile from '../assets/profile.png';
import { AiFillDelete, AiFillEdit, AiFillEye } from 'react-icons/ai';

const UserTable = () => {
  const [user, setUser] = useState([]);
  const [error, setError] = useState(null);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [editingUser, setEditingUser] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailUser, setDetailUser] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  // Global search
  const [search, setSearch] = useState('');

  // Filter states
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterPhone, setFilterPhone] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all | active | inactive
  const [appliedFilters, setAppliedFilters] = useState({
    name: '',
    phone: '',
    status: 'all'
  });

  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();

  // Fetch users
  const fetchUsers = () => {
    setLoading(true);
    let url = `/api/admin/users?page=${page}&limit=${limit}`;
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
  }, [page, limit]);

  // Sorting
  const handleSort = (fieldName) => {
    if (sortField === fieldName) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(fieldName);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const renderSortArrow = (fieldName) =>
    sortField !== fieldName ? null : sortOrder === 'asc' ? ' ▲' : ' ▼';

  // Apply filters
  const handleApplyFilters = () => {
    setAppliedFilters({
      name: filterName,
      phone: filterPhone,
      status: filterStatus
    });
    setPage(1);
  };

  // Global search change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Filter + Search + Sorting
  const sortedUsers = useMemo(() => {
    let usersCopy = [...user];

    // Global search
    if (search.trim() !== '') {
      usersCopy = usersCopy.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.phone && u.phone.includes(search))
      );
    }

    // Applied filters
    if (appliedFilters.name.trim() !== '') {
      usersCopy = usersCopy.filter(u => u.name.toLowerCase().includes(appliedFilters.name.toLowerCase()));
    }
    if (appliedFilters.phone.trim() !== '') {
      usersCopy = usersCopy.filter(u => u.phone?.includes(appliedFilters.phone));
    }
    if (appliedFilters.status !== 'all') {
      usersCopy = usersCopy.filter(u =>
        appliedFilters.status === 'active' ? u.is_verified : !u.is_verified
      );
    }

    // Sorting
    usersCopy.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (valA === undefined) valA = '';
      if (valB === undefined) valB = '';
      if (typeof valA === 'boolean') valA = valA ? 1 : 0;
      if (typeof valB === 'boolean') valB = valB ? 1 : 0;
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return usersCopy;
  }, [user, sortField, sortOrder, appliedFilters, search]);

  const formatDateForUI = (dateString) =>
    new Date(dateString).toLocaleDateString('en-GB');

  const handlePrevPage = () => setPage(p => (p > 1 ? p - 1 : p));
  const handleNextPage = () => setPage(p => p + 1);

  const toggleVerification = (u) => {
    const updatedUser = { is_verified: u.is_verified ? 0 : 1 };
    fetch(`/api/admin/users/${u.id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(updatedUser),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update status');
        fetchUsers();
      })
      .catch(err => alert(err.message));
  };

  const handleDelete = (u) => {
    if (window.confirm('Are you sure to delete this user?')) {
      fetch(`/api/admin/users/${u.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => { if (!res.ok) throw new Error('Delete failed'); fetchUsers(); })
        .catch(err => alert(err.message));
    }
  };

  const handleEditSave = (updatedUser) => {
    fetch(`/api/admin/users/${updatedUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(updatedUser),
    })
      .then(res => {
        if (!res.ok) throw new Error('Update failed');
        setEditModalOpen(false);
        setEditingUser(null);
        fetchUsers();
      })
      .catch(err => alert(err.message));
  };

  const EditUserModal = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState(user || {});
    useEffect(() => { setFormData(user || {}); }, [user]);
    if (!user) return null;
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Edit User</h2>
          <label className="block mb-2">Name:
            <input name="name" value={formData.name || ''} onChange={handleChange} className="border p-2 rounded w-full" />
          </label>
          <label className="block mb-2">Email:
            <input name="email" value={formData.email || ''} onChange={handleChange} type="email" className="border p-2 rounded w-full" />
          </label>
          <label className="block mb-2">Phone:
            <input name="phone" value={formData.phone || ''} onChange={handleChange} className="border p-2 rounded w-full" />
          </label>
          <div className="flex justify-end space-x-4 mt-4">
            <button className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400" onClick={onClose}>Cancel</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => onSave(formData)}>Save</button>
          </div>
        </div>
      </div>
    );
  };

  const UserDetailModal = ({ user, onClose }) => {
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
          <div className="flex justify-end mt-4">
            <button className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="px-2 md:px-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Users</h1>
        <button onClick={() => navigate(`/add-user`)} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">Add User</button>
      </div>

      <div className="mx-auto bg-white rounded-xl shadow pb-2">
        {/* Top Controls: Global Search + Filter */}
        <div className="flex flex-wrap items-center justify-between px-6 py-4 gap-4">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search user..."
            className="w-96 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            onClick={() => setFilterVisible(!filterVisible)}
            className="flex items-center px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
          <svg width="24" height="24" fill="none" stroke="currentColor" className="text-gray-400" viewBox="0 0 24 24" > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.618a2 2 0 01-.553 1.316l-6.64 7.42a2 2 0 00-.36 1.1V19a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3.546a2 2 0 00-.36-1.1l-6.639-7.42A2 2 0 013 6.618V4z" /> </svg>
          </button>
        </div>

        {/* Filter Dropdown */}
        {filterVisible && (
          <div className="flex flex-wrap items-center space-x-4 px-6 py-4 border-t border-b bg-gray-50 content-center justify-center">
            <input type="text" placeholder="Search Name" className="px-4 py-2 border rounded w-64" value={filterName} onChange={(e) => setFilterName(e.target.value)} />
            <input type="text" placeholder="Search Phone" className="px-4 py-2 border rounded w-64" value={filterPhone} onChange={(e) => setFilterPhone(e.target.value)} />
            <select className="px-8 py-2 border rounded " value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleApplyFilters}>Apply</button>
          </div>
        )}

        {/* Data Table */}
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 text-gray-600 border-b">
              <th className="p-4 font-semibold text-left cursor-pointer">#</th>
              <th className="p-4 font-semibold text-left cursor-pointer" onClick={() => handleSort('name')}>Name{renderSortArrow('name')}</th>
              <th className="p-4 font-semibold text-left cursor-pointer" onClick={() => handleSort('email')}>Email{renderSortArrow('email')}</th>
              <th className="p-4 font-semibold text-left cursor-pointer" onClick={() => handleSort('phone')}>Phone{renderSortArrow('phone')}</th>
              <th className="p-4 font-semibold text-left cursor-pointer" onClick={() => handleSort('is_verified')}>Verified{renderSortArrow('is_verified')}</th>
              <th className="p-4 font-semibold text-left cursor-pointer" onClick={() => handleSort('created_at')}>Created At{renderSortArrow('created_at')}</th>
              <td className="p-4 font-semibold text-left">Action</td>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-4 text-center">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={7} className="p-4 text-center text-red-500">{error}</td></tr>
            ) : sortedUsers.length === 0 ? (
              <tr><td colSpan={7} className="p-4 text-center">No users found.</td></tr>
            ) : (
              sortedUsers.map((u, index) => (
                <tr key={u.id} className="hover:bg-gray-100">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4 flex items-center">
                    <img src={u.profile_pic || profile} alt={u.name} className="w-10 h-10 rounded-full mr-2" />
                    {u.name}
                  </td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">{u.phone}</td>
                  <td className="p-4">{u.is_verified ? 'Active' : 'Inactive'}</td>
                  <td className="p-4">{formatDateForUI(u.created_at)}</td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => { setDetailUser(u); setDetailModalOpen(true); }} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-gray-700"><AiFillEye size={20} /></button>
                    <button onClick={() => { setEditingUser(u); setEditModalOpen(true); }} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"><AiFillEdit size={20} /></button>
                    <button onClick={() => handleDelete(u)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"><AiFillDelete size={20} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-end space-x-2 px-6 py-4">
          <button onClick={handlePrevPage} disabled={page === 1} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Previous</button>
          <button onClick={handleNextPage} disabled={page >= totalPages} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Next</button>
        </div>
      </div>

      {editModalOpen && <EditUserModal user={editingUser} onClose={() => setEditModalOpen(false)} onSave={handleEditSave} />}
      {detailModalOpen && <UserDetailModal user={detailUser} onClose={() => setDetailModalOpen(false)} />}
    </div>
  );
};

export default UserTable;
