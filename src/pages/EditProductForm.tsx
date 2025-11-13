// import React, { useState, useEffect } from 'react';

// const EditProductForm = ({ product, onCancel, onSuccess }) => {
//     console.log('Editing product:', product);
//   const [values, setValues] = useState({
//     subcategory_id: product.subcategory_id || '',
//     name: product.name || '',
//     description: product.description || '',
//     category_id: product.category_id || '',
//     unit: product.unit || '',
//     price: product.price || '',
//     offer: product.offer || '',
//     images: product.images && product.images.length > 0 ? product.images : [''],
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);

//   useEffect(() => {
//     // Reset values if product changes
//     setValues({
//       subcategory_id: product.subcategory_id || '',
//       name: product.name || '',
//       description: product.description || '',
//       category_id: product.category_id || '',
//       unit: product.unit || '',
//       price: product.price || '',
//       offer: product.offer || '',
//       images: product.images && product.images.length > 0 ? product.images : [''],
//     });
//   }, [product]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setValues(prev => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (i, val) => {
//     const updated = [...values.images];
//     updated[i] = val;
//     setValues(prev => ({ ...prev, images: updated }));
//   };

//   const addImageField = () => {
//     setValues(prev => ({ ...prev, images: [...prev.images, ''] }));
//   };

//   const removeImageField = (i) => {
//     const updated = values.images.filter((_, idx) => idx !== i);
//     setValues(prev => ({ ...prev, images: updated }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccess(false);
//     try {
//       const response = await fetch(`/product/${product.id}`, {
//         method: 'PUT', // Assuming update method on your API
//         headers: {
//           'Content-Type': 'application/json',
//         //   Authorization: `Bearer YOUR_BEARER_TOKEN_HERE`,
//         },
//         body: JSON.stringify({
//           ...values,
//           price: parseFloat(values.price),
//           offer: parseInt(values.offer, 10),
//           category_id: parseInt(values.category_id, 10),
//           subcategory_id: parseInt(values.subcategory_id, 10),
//         }),
//       });
//       if (!response.ok) throw new Error(`Update failed: ${response.status}`);
//       setSuccess(true);
//       onSuccess && onSuccess();
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 max-w-md mx-auto my-6">
//       <h2 className="text-2xl font-semibold mb-6 text-center">Edit Product</h2>

//       {error && <div className="mb-4 text-red-600">{error}</div>}
//       {success && <div className="mb-4 text-green-600">Product updated successfully!</div>}

//       {/* Include inputs exactly like AddProductForm */}
//       <label className="block mb-2 text-sm font-medium">Category ID</label>
//       <input
//         name="category_id"
//         type="number"
//         value={values.category_id}
//         onChange={handleChange}
//         className="w-full mb-4 border rounded px-3 py-2"
//         required
//       />

//       <label className="block mb-2 text-sm font-medium">Subcategory ID</label>
//       <input
//         name="subcategory_id"
//         type="number"
//         value={values.subcategory_id}
//         onChange={handleChange}
//         className="w-full mb-4 border rounded px-3 py-2"
//         required
//       />

//       <label className="block mb-2 text-sm font-medium">Product Name</label>
//       <input
//         name="name"
//         value={values.name}
//         onChange={handleChange}
//         className="w-full mb-4 border rounded px-3 py-2"
//         required
//       />

//       <label className="block mb-2 text-sm font-medium">Description</label>
//       <textarea
//         name="description"
//         value={values.description}
//         onChange={handleChange}
//         className="w-full mb-4 border rounded px-3 py-2"
//         rows={3}
//         required
//       />

//       <label className="block mb-2 text-sm font-medium">Unit</label>
//       <input
//         name="unit"
//         value={values.unit}
//         onChange={handleChange}
//         className="w-full mb-4 border rounded px-3 py-2"
//         required
//       />

//       <label className="block mb-2 text-sm font-medium">Price</label>
//       <input
//         name="price"
//         type="number"
//         step="0.01"
//         value={values.price}
//         onChange={handleChange}
//         className="w-full mb-4 border rounded px-3 py-2"
//         required
//       />

//       <label className="block mb-2 text-sm font-medium">Offer (%)</label>
//       <input
//         name="offer"
//         type="number"
//         value={values.offer}
//         onChange={handleChange}
//         className="w-full mb-4 border rounded px-3 py-2"
//         required
//       />

//       <label className="block mb-2 text-sm font-medium">Image URLs</label>
//       {values.images.map((img, idx) => (
//         <div key={idx} className="flex items-center mb-2">
//           <input
//             type="url"
//             value={img}
//             placeholder={`Image URL ${idx + 1}`}
//             onChange={e => handleImageChange(idx, e.target.value)}
//             className="flex-1 border rounded px-3 py-2"
//           />
//           {values.images.length > 1 && (
//             <button
//               type="button"
//               onClick={() => removeImageField(idx)}
//               className="ml-2 text-red-500 hover:text-red-700"
//             >
//               ×
//             </button>
//           )}
//         </div>
//       ))}
//       <button
//         type="button"
//         onClick={addImageField}
//         className="mb-4 text-indigo-600 hover:underline text-sm"
//       >
//         + Add another image
//       </button>

//       <div className="flex justify-between items-center">
//         <button
//           type="button"
//           onClick={onCancel}
//           className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
//           disabled={loading}
//         >
//           Cancel
//         </button>
//         <button
//           type="submit"
//           className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
//           disabled={loading}
//         >
//           {loading ? 'Updating...' : 'Save Changes'}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default EditProductForm;
const EditProductForm = () => {
    return (
        <div>Edit Product Form</div>
    )
}       
export default EditProductForm;