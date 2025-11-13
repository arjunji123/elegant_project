import React, { useState, useEffect } from 'react';
// import { AiFillEdit, AiFillEye } from 'react-icons/ai'; // icons if you want
import { useNavigate } from 'react-router-dom';
import { AiOutlineFundView, AiFillEdit } from 'react-icons/ai';
import { useProduct } from '@/context/ProductContext';

const ORDER_STATUSES = ['Pending', 'Shipped', 'Delivered'];

const EditOrderModal = ({ order, onClose, onSave }) => {
    const [status, setStatus] = useState(order?.status || 'Pending');
    const [loading, setLoading] = useState(false);
    const { token } = useProduct();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/admin/orders/${order.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `bearer ${token}`,
                },
                body: JSON.stringify({ status: status }),
            });
            if (!res.ok) throw new Error('Failed to update order.');
            onSave();
            onClose();
            console.log("Status updated! Notification sent."); // Replace with toast or notification in production
        } catch (err) {
            console.log("Error updating order: " + err.message);
        } finally {
            setLoading(false);
        }
    };


    if (!order) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-sm">
                <h2 className="text-xl font-semibold mb-4">Edit Order Status</h2>
                <form onSubmit={handleSubmit}>
                    <label className="block mb-2 font-medium">Status</label>
                    <select
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        className="w-full mb-4 border border-gray-300 rounded px-3 py-2"
                    >
                        {ORDER_STATUSES?.map(s => (
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

// Simple modal for order details
const OrderDetailModal = ({ order, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <b>Customer:</b> {order.user_name}<br />
            <b>Email:</b> {order.user_email}<br />
            <b>Amount:</b>{order.subtotal}
            <ul>
                {order.products && order.products?.map(prod => <li key={prod.id}>{prod.name} x{prod.quantity}</li>)}
            </ul>
            <b>Status:</b> {order.status}
            <div className="mt-4 flex justify-end">
                <button onClick={onClose}
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                    Close
                </button>
            </div>
        </div>
    </div>
);

// Main order list
export const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { token } = useProduct();
    useEffect(() => {
        setLoading(true);
        let url = '/api/admin/orders';
        if (filter) url += `?status=${filter}`;
        fetch(url, { headers: { Authorization: `bearer ${token}` } })
            .then(res => res.json())
            .then(data => setOrders(data.data || []))
            .catch(() => setOrders([]))
            .finally(() => setLoading(false));
    }, [filter]);
console.log('Orders:', orders);
    // Refresh orders after edit
    const refreshOrders = () => {
        setLoading(true);
        let url = '/api/admin/orders';
        if (filter) url += `?status=${filter}`;
        fetch(url, { headers: { Authorization: `bearer ${token}`  } })
            .then(res => res.json())
            .then(data => setOrders(data.data || []))
            .catch(() => setOrders([]))
            .finally(() => setLoading(false));
    };

    // Open modals
    const openEditModal = order => { setSelectedOrder(order); setEditModalOpen(true); };
    const closeEditModal = () => { setEditModalOpen(false); setSelectedOrder(null); };
    const openDetailModal = order => { setSelectedOrder(order); setDetailModalOpen(true); };
    const closeDetailModal = () => { setDetailModalOpen(false); setSelectedOrder(null); };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Orders</h1>
                <div>
                    <select value={filter} onChange={e => setFilter(e.target.value)}
                        className="px-4 py-2 border rounded-lg">
                        <option value="">All Status</option>
                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>
            {loading ? <div>Loading...</div> : (
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
                                <td className="p-4">{order.user_name
                                }</td>
                                <td className="p-4">{order.status}</td>
                                <td className="p-4 text-center space-x-2">
                                    <button
                                        onClick={() => openDetailModal(order)}
                                        className="text-green-600 hover:text-green-800" aria-label="View">

                                        <AiOutlineFundView size={20} />
                                    </button>
                                    <button
                                        onClick={() => openEditModal(order)}
                                        className="text-blue-600 hover:text-blue-800" aria-label="Edit">
                                        <AiFillEdit size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {/* Modals */}
            {editModalOpen && selectedOrder && (
                <EditOrderModal
                    order={selectedOrder}
                    onClose={closeEditModal}
                    onSave={refreshOrders}
                />
            )}
            {detailModalOpen && selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={closeDetailModal}
                />
            )}
        </div>
    );
};
