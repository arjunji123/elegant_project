import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Products from './pages/Products'
import Blog from './pages/Blog'
import AddProductForm from './pages/AddProduct'
import EditProductForm from './pages/EditProductForm'
import SignInPage from './pages/SignInPage'
import { AddCategories, CategoriesList } from './pages/CategoriesList'
import { SubcategoriesList, AddSubcategories } from './pages/AddSubcategories'
import {OrdersList} from './pages/Order'
import { useProduct } from './context/ProductContext'
import OrderDetailPage from './pages/OrderDetailPage'

export default function App() {
  const { signIn } = useProduct();

  if (!signIn) {
    // User not signed in: only allow signin page, all else redirect to signin
    return (
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    );
  }

  // User signed in: show all routes inside MainLayout
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="products" element={<Products />} />
        <Route path="blog" element={<Blog />} />
        <Route path="add-product" element={<AddProductForm />} />
        <Route path="add-categories" element={<AddCategories />} />
        <Route path="categories" element={<CategoriesList />} />
        <Route path="add-sub-categories" element={<AddSubcategories />} />
        <Route path="sub-categories" element={<SubcategoriesList />} />
        <Route path="orders" element={<OrdersList />} />
        <Route path="order-detail" element={<OrderDetailPage />} />

        {/* <Route path="edit-product" element={<EditProductForm />} /> */}
        <Route path="signin" element={<Navigate to="/" replace />} /> {/* Redirect if signed in */}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
