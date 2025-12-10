# New Admin APIs Documentation

## ✅ Created APIs for Frontend Implementation

### 1. 📊 Earnings Analytics API (for Chart.js)

**Endpoint:** `GET /api/admin/earnings-analytics`

**Headers:**
```json
{
  "Authorization": "Bearer <admin_token>"
}
```

**Query Parameters:**
- `period` (required): `'today'` | `'week'` | `'month'`

**Response Format:**
```json
{
  "success": true,
  "period": "week",
  "data": {
    "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    "earnings": [1200, 1500, 980, 2100, 1750, 2300, 1900],
    "total": 11730.00,
    "average": 1675.71
  }
}
```

**Usage Examples:**

```javascript
// Frontend - Chart.js Integration
const fetchEarningsData = async (period) => {
  const response = await fetch(`/api/admin/earnings-analytics?period=${period}`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  const result = await response.json();
  
  // Use with Chart.js
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: result.data.labels,
      datasets: [{
        label: 'Earnings',
        data: result.data.earnings,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    }
  });
};
```

**Period Details:**
- **today**: Returns 24-hour breakdown (0:00 to 23:00)
- **week**: Returns last 7 days (Mon to Sun)
- **month**: Returns current month daily breakdown (Day 1 to Day 30/31)

---

### 2. 👤 Create User Manually (Admin)

**Endpoint:** `POST /api/admin/users/create`

**Headers:**
```json
{
  "Authorization": "Bearer <admin_token>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "securepass123",
  "is_verified": true,    // Optional, default: true
  "is_admin": false       // Optional, default: false
}
```

**Validations:**
- ✅ `name`: Minimum 2 characters (required)
- ✅ `email`: Valid email format, must be unique (required)
- ✅ `phone`: Exactly 10 digits, must be unique (required)
- ✅ `password`: Minimum 6 characters (required)
- ✅ `is_verified`: Boolean (optional)
- ✅ `is_admin`: Boolean (optional)

**Success Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "is_verified": 1,
    "is_admin": 0,
    "created_at": "2025-12-11T10:30:00.000Z"
  }
}
```

**Error Responses:**
```json
// Validation errors (400)
{
  "success": false,
  "errors": [
    {
      "msg": "Name must be at least 2 characters",
      "param": "name"
    }
  ]
}

// Duplicate email (400)
{
  "success": false,
  "message": "Email already exists"
}

// Duplicate phone (400)
{
  "success": false,
  "message": "Phone number already exists"
}
```

**Frontend Implementation Example:**
```javascript
// React/Vue Modal Form
const createUser = async (userData) => {
  try {
    const response = await fetch('/api/admin/users/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      showSuccessMessage('User created successfully!');
      refreshUserList();
      closeModal();
    } else {
      showErrors(result.errors || result.message);
    }
  } catch (error) {
    showErrorMessage('Failed to create user');
  }
};
```

---

### 3. 🔍 Enhanced User Filter API

**Endpoint:** `GET /api/admin/users`

**Headers:**
```json
{
  "Authorization": "Bearer <admin_token>"
}
```

**Query Parameters:**
- `search` (optional): Search by name, email, or phone
- `is_verified` (optional): `'true'` | `'false'` | `'all'`
- `is_admin` (optional): `'true'` | `'false'` | `'all'`
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Example Requests:**
```
GET /api/admin/users?search=john&is_verified=true&page=1&limit=20
GET /api/admin/users?is_admin=false&is_verified=true
GET /api/admin/users?search=9876
```

**Response Format:**
```json
{
  "success": true,
  "message": "Users listed successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "profile_pic": "https://...",
      "is_verified": 1,
      "is_admin": 0,
      "created_at": "2025-12-01T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

**Frontend Implementation Example:**
```javascript
// React/Vue User Table with Filters
const fetchUsers = async (filters) => {
  const params = new URLSearchParams();
  
  if (filters.search) params.append('search', filters.search);
  if (filters.isVerified !== 'all') params.append('is_verified', filters.isVerified);
  if (filters.isAdmin !== 'all') params.append('is_admin', filters.isAdmin);
  params.append('page', filters.page || 1);
  params.append('limit', filters.limit || 10);
  
  const response = await fetch(`/api/admin/users?${params}`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  
  return await response.json();
};
```

---

## 🔧 Fixed Issues

### User Filter - What Was Fixed:
1. ✅ **Added `is_admin` filter** - Now you can filter users by admin status
2. ✅ **Better query handling** - Separate params for count and data queries
3. ✅ **Added 'all' option** - Can pass `'all'` to show all users regardless of status
4. ✅ **Fixed search trimming** - Whitespace is properly handled
5. ✅ **Better error handling** - More descriptive error messages
6. ✅ **Return `is_admin` field** - Previously missing from response

### Issues Fixed:
- Filter was not working because of incorrect boolean handling in query params
- Count query was using same params array causing incorrect pagination
- Missing `is_admin` field in SELECT statement

---

## 📝 Database Fields Used

Based on code analysis, here are the relevant DB fields:

### `users` Table:
```sql
- id (Primary Key)
- name
- email (Unique)
- phone (Unique)
- password (hashed)
- profile_pic (nullable)
- is_verified (tinyint: 0/1)
- is_admin (tinyint: 0/1)
- created_at (timestamp)
```

### `orders` Table (for earnings):
```sql
- id (Primary Key)
- user_id
- total_amount
- payment_status ('pending', 'completed', 'failed')
- created_at (timestamp)
```

---

## 🚀 Testing the APIs

### Using cURL:

```bash
# 1. Get earnings for this week
curl -X GET "http://localhost:8080/api/admin/earnings-analytics?period=week" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# 2. Create new user
curl -X POST "http://localhost:8080/api/admin/users/create" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9999999999",
    "password": "password123",
    "is_verified": true
  }'

# 3. Filter verified users
curl -X GET "http://localhost:8080/api/admin/users?is_verified=true&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# 4. Search users
curl -X GET "http://localhost:8080/api/admin/users?search=john" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Using Postman:

1. **Set Authorization:**
   - Type: Bearer Token
   - Token: Your admin JWT token

2. **Test Earnings API:**
   - Method: GET
   - URL: `http://localhost:8080/api/admin/earnings-analytics?period=today`

3. **Test Create User:**
   - Method: POST
   - URL: `http://localhost:8080/api/admin/users/create`
   - Body (JSON):
   ```json
   {
     "name": "Admin Test",
     "email": "admin.test@example.com",
     "phone": "8888888888",
     "password": "admin123"
   }
   ```

---

## 📊 Frontend Implementation Guide

### Chart.js Setup for Earnings:

```javascript
// Install: npm install chart.js

import { Line } from 'chart.js';

const EarningsChart = () => {
  const [period, setPeriod] = useState('week');
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchEarningsData(period);
  }, [period]);

  const fetchEarningsData = async (period) => {
    const response = await fetch(
      `/api/admin/earnings-analytics?period=${period}`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    const result = await response.json();
    
    if (result.success) {
      setChartData({
        labels: result.data.labels,
        datasets: [{
          label: `Earnings (${period})`,
          data: result.data.earnings,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true
        }]
      });
    }
  };

  return (
    <div>
      <select onChange={(e) => setPeriod(e.target.value)} value={period}>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
      </select>
      
      {chartData && <Line data={chartData} />}
      
      <p>Total: ₹{chartData?.datasets[0]?.total}</p>
      <p>Average: ₹{chartData?.datasets[0]?.average}</p>
    </div>
  );
};
```

### Add User Modal (React):

```javascript
import { useState } from 'react';

const AddUserModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    is_verified: true,
    is_admin: false
  });
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    try {
      const response = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        onSuccess(result.data);
        onClose();
      } else {
        setErrors(result.errors || [{ msg: result.message }]);
      }
    } catch (error) {
      setErrors([{ msg: 'Network error occurred' }]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <h2>Add New User</h2>
        
        <input
          type="text"
          placeholder="Full Name *"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />

        <input
          type="email"
          placeholder="Email *"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />

        <input
          type="tel"
          placeholder="Phone (10 digits) *"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          pattern="[0-9]{10}"
          required
        />

        <input
          type="password"
          placeholder="Password (min 6 chars) *"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          minLength="6"
          required
        />

        <label>
          <input
            type="checkbox"
            checked={formData.is_verified}
            onChange={(e) => setFormData({...formData, is_verified: e.target.checked})}
          />
          Verified User
        </label>

        <label>
          <input
            type="checkbox"
            checked={formData.is_admin}
            onChange={(e) => setFormData({...formData, is_admin: e.target.checked})}
          />
          Admin User
        </label>

        {errors.length > 0 && (
          <div className="errors">
            {errors.map((err, idx) => (
              <p key={idx} className="error">{err.msg}</p>
            ))}
          </div>
        )}

        <button type="submit">Create User</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};
```

### User Filter Component:

```javascript
const UserFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: '',
    is_verified: 'all',
    is_admin: 'all',
    page: 1,
    limit: 10
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Search by name, email, phone..."
        value={filters.search}
        onChange={(e) => handleFilterChange('search', e.target.value)}
      />

      <select 
        value={filters.is_verified}
        onChange={(e) => handleFilterChange('is_verified', e.target.value)}
      >
        <option value="all">All Users</option>
        <option value="true">Verified Only</option>
        <option value="false">Unverified Only</option>
      </select>

      <select 
        value={filters.is_admin}
        onChange={(e) => handleFilterChange('is_admin', e.target.value)}
      >
        <option value="all">All Roles</option>
        <option value="true">Admins Only</option>
        <option value="false">Regular Users</option>
      </select>

      <select 
        value={filters.limit}
        onChange={(e) => handleFilterChange('limit', e.target.value)}
      >
        <option value="10">10 per page</option>
        <option value="25">25 per page</option>
        <option value="50">50 per page</option>
        <option value="100">100 per page</option>
      </select>
    </div>
  );
};
```

---

## 🔐 Authentication Required

All these APIs require **Admin authentication**:
1. User must be logged in (valid JWT token)
2. User must have `is_admin = 1` in database
3. Pass token in header: `Authorization: Bearer <token>`

---

## 📦 Dependencies Already Installed

These packages are already in your `package.json`:
- ✅ `express-validator` - For request validation
- ✅ `bcryptjs` - For password hashing
- ✅ `mysql2` - For database queries

---

## ⚠️ Important Notes

1. **Password Security**: Passwords are automatically hashed using bcrypt (10 rounds)
2. **Email/Phone Uniqueness**: Checked before insertion, returns 400 if duplicate
3. **Earnings Calculation**: Only counts orders with `payment_status = 'completed'`
4. **Date Timezone**: Uses MySQL's `CURDATE()` and server timezone
5. **Pagination**: Max limit is 100 to prevent performance issues

---

## 🎯 Next Steps for Frontend

1. **Create Dashboard Page:**
   - Add Chart.js for earnings visualization
   - Add period selector (Today/Week/Month)
   - Show total and average earnings

2. **Create User Management Page:**
   - Add "Add User" button → Opens modal
   - Add filter dropdowns (verified, admin, search)
   - Add pagination controls
   - Show user table with actions

3. **Test All APIs:**
   - Use Postman/Thunder Client
   - Test validation errors
   - Test filter combinations
   - Test pagination

---

**Created by:** AI Assistant
**Date:** December 11, 2025
**Files Modified:**
- `elegant_be/controllers/adminDashboardController.js`
- `elegant_be/controllers/adminUserController.js`
- `elegant_be/routes/adminDashboardRoutes.js`
- `elegant_be/routes/adminUserRoutes.js`
