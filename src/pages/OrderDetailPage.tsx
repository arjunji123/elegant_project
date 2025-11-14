import { useProduct } from '@/context/ProductContext';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function OrderDetailPage() {
  const { id } = useParams(); // get order ID from URL params
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('authToken');
const {ordertId} = useProduct();

console.log("Order ID in detail page:",ordertId);
  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/orders/${ordertId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch order');
        return res.json();
      })
      .then(data => setOrder(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, token]);

  if (loading) return <div>Loading order details...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!order) return <div>No order found.</div>;
console.log("Order details:", order.data
);
return (
  <div className="bg-white border rounded-lg shadow p-6 mx-auto">
    <button
      onClick={() => navigate(-1)}
      className="mb-4 text-indigo-600 hover:underline"
    >
      ← Back to Orders
    </button>
    <h1 className="text-2xl font-bold mb-4">
      Order Details - #{order.data.id}
    </h1>

    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Customer Information</h2>
      <p>
        <b>Name:</b> {order.data.user_name}
      </p>
      <p>
        <b>Email:</b> {order.data.user_email}
      </p>
      <p>
        <b>Phone:</b> {order.data.user_phone || "N/A"}
      </p>
    </section>

    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Products</h2>
      <table className="w-full border border-gray-300 rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">Product Name</th>
            <th className="border px-4 py-2 text-left">Quantity</th>
            <th className="border px-4 py-2 text-left">Price</th>
          </tr>
        </thead>
        <tbody>
          {order.data &&
            order.data.items.map((item) => (
              <tr key={item.id}>
                <td className="border px-4 py-2">{item.product_name}</td>
                <td className="border px-4 py-2">{item.quantity}</td>
                <td className="border px-4 py-2">
                  ${parseFloat(item.price).toFixed(2)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </section>

    <section>
      <h2 className="text-xl font-semibold">Order Summary</h2>
      <p>
        <b>Status:</b> {order.data.status}
      </p>
      <p>
        <b>Total Amount:</b>₹ {order.data.subtotal}
      </p>
    </section>
  </div>
);

}
