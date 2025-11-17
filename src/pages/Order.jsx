import React, { useState, useEffect } from 'react';
import { AiOutlineFundView, AiFillEdit } from 'react-icons/ai';
import { useProduct } from '@/context/ProductContext';

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

// Edit Order Modal
const EditOrderModal = ({ order, onClose, onSave }) => {
  const [status, setStatus] = useState(order?.status || 'pending');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('authToken');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update order.');
      if (onSave) onSave();
      if (onClose) onClose();
      window.alert(`Order status updated to ${status}`);
    } catch (err) {
      console.log("Error updating order: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Edit Order Status</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="w-full mb-4 border border-gray-300 rounded px-3 py-2"
          >
            {ORDER_STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400" disabled={loading}>
              Cancel
            </button>
            <button type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const OrderDetailModal = ({ order, onClose, loading }) => {
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          Loading order details...
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full overflow-auto max-h-[80vh]">
        <h2 className="text-2xl font-semibold mb-4">Order Details - #{order.id}</h2>
        {/* Customer info, products, summary */}
        <section className="mb-4">
          <h3 className="font-semibold">Customer Information</h3>
          <p><b>Name:</b> {order.user_name}</p>
          <p><b>Email:</b> {order.user_email}</p>
          <p><b>Phone:</b> {order.user_phone || 'N/A'}</p>
        </section>
        <section className="mb-4">
          <h3 className="font-semibold">Products</h3>
          <table className="w-full border border-gray-300 rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1 text-left">Product Name</th>
                <th className="border px-2 py-1 text-left">Quantity</th>
                <th className="border px-2 py-1 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map(item => (
                <tr key={item.id}>
                  <td className="border px-2 py-1">{item.product_name}</td>
                  <td className="border px-2 py-1">{item.quantity}</td>
                  <td className="border px-2 py-1">₹{parseFloat(item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="mb-4">
          <h3 className="font-semibold">Order Summary</h3>
          <p><b>Status:</b> {order.status}</p>
          <p><b>Total Amount:</b> ₹{order.subtotal}</p>
        </section>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


// Main Orders List
export const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false); // For table
  const [modalLoading, setModalLoading] = useState(false); // For modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const token = localStorage.getItem('authToken');

  const fetchOrders = () => {
    setLoading(true);
    let url = '/api/admin/orders';
    if (filter) url += `?status=${filter}`;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setOrders(data.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const openDetailModal = async (order) => {
    setModalLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSelectedOrder(data.data || order);
      setDetailModalOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  const closeDetailModal = () => { setDetailModalOpen(false); setSelectedOrder(null); };

  const openEditModal = order => { setSelectedOrder(order); setEditModalOpen(true); };
  const closeEditModal = () => { setEditModalOpen(false); setSelectedOrder(null); };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        <div>
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="">All Status</option>
            {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {loading ? <div>Loading orders...</div> : (
        <table className="min-w-full bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-700 border-b-2 border-gray-200">
              <th className="p-4 text-left">Order No</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-100">
                <td className="p-4">{order.id}</td>
                <td className="p-4">{order.user_name}</td>
                <td className="p-4">{order.status}</td>
                <td className="p-4 text-center space-x-2">
                  <button
                    onClick={() => openDetailModal(order)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <AiOutlineFundView size={20} />
                  </button>

                  <button
                    onClick={() => openEditModal(order)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <AiFillEdit size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Detail Modal */}
      {detailModalOpen && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={closeDetailModal}
          loading={modalLoading} // pass modal-specific loading
        />
      )}

      {/* Edit Modal */}
      {editModalOpen && selectedOrder && (
        <EditOrderModal order={selectedOrder} onClose={closeEditModal} onSave={fetchOrders} />
      )}
    </div>
  );
};

