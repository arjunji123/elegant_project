# Copilot Instructions for elegant_project

## Architecture & Data Flow
- **E-commerce REST API** built on Node.js + Express + MySQL2
- **Entry points**: `elegant_be/server.js` (CORS, env config, DB init) → `elegant_be/app.js` (route registration, Swagger UI at `/docs`)
- **Database**: MySQL connection pool in `config/db.js` using `mysql2/promise`. Connection verified on startup; server exits if DB unreachable
- **Data flows**: Routes → Middleware (auth/admin/upload) → Controllers → MySQL queries → Response
- **Key boundary**: Admin vs User endpoints separated (`adminAuthRoutes`, `adminCategoryRoutes`, etc.) with role-based middleware

## Critical Developer Workflows
```bash
# Development (with auto-reload)
cd elegant_be && npm run dev

# Production
cd elegant_be && npm start

# Regenerate Swagger docs
cd elegant_be && npm run swagger
```
- **Debugging**: Server logs DB connection status on startup. Controllers use raw SQL queries via `db.query()` - check queries for debugging
- **API docs**: Always at `http://localhost:8080/docs` (Swagger UI). Update via `npm run swagger` after route changes
- **No test suite**: Tests not configured; consider adding Jest/Mocha to `elegant_be/package.json`

## Authentication & Authorization Pattern
```javascript
// Standard protected route (example from productRoutes.js)
router.get('/wishlist', authMiddleware, getWishlist);

// Admin-only route pattern
router.post('/admin/categories', authMiddleware, adminMiddleware, createCategory);
```
- **Auth flow**: 
  1. `authMiddleware` extracts JWT from `Authorization: Bearer <token>` header
  2. Verifies with `JWT_SECRET`, attaches `req.user.id`
  3. `adminMiddleware` queries `users.is_admin` flag (1 = admin)
- **Token generation**: `utils/generateToken.js` creates 7-day JWTs
- **CRITICAL**: Always chain `authMiddleware` before `adminMiddleware`

## File Upload Architecture
- **Storage**: Cloudinary for production uploads (products, category icons, profile pics)
- **Local uploads**: Organized in `elegant_be/uploads/{products,category_icons,profile_pics}/` for static serving
- **Upload middleware pattern**:
  ```javascript
  // Example from productUpload.js
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "products",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      public_id: (req, file) => `product_${Date.now()}`
    }
  });
  ```
- **Route usage**: `router.post('/product', upload.array("images", 5), createProduct)`
- **WHY**: Images stored on Cloudinary auto-scale, uploads folder serves as backup/local dev option

## Database Query Patterns
- **Connection**: Use `const db = require('../config/db')` (promise-based pool)
- **Destructuring pattern**: `const [rows] = await db.query(sql, params)` or `const [[singleRow]] = await db.query(sql, params)`
- **Example**: Product filtering with LEFT JOINs for wishlist state:
  ```javascript
  const [products] = await db.query(`
    SELECT p.*, 
           CASE WHEN w.id IS NOT NULL THEN 1 ELSE 0 END AS is_wishlist
    FROM products p
    LEFT JOIN wishlist w ON w.product_id = p.id AND w.user_id = ?
    WHERE p.category_id IN (?)
  `, [userId, categoryIds]);
  ```
- **Related data**: Fetch images separately after main query, map by `product_id` (see `productController.js` lines 75-90)

## Payment Integration (Razorpay)
- **Order creation**: Controller creates Razorpay order, stores `razorpay_order_id` in DB with `payment_status: "pending"`
- **Verification flow**: Frontend sends `razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature` → backend verifies HMAC signature → updates status to "completed"
- **Critical**: Always verify signature with `crypto.createHmac('sha256', RAZORPAY_KEY_SECRET)` before trusting payment (see `orderController.js`)

## Adding New Features
1. **New resource** (e.g., reviews):
   - Create `controllers/reviewController.js` with exports (createReview, getReviews, etc.)
   - Create `routes/reviewRoutes.js`, import controller + middleware
   - Add to `app.js`: `app.use('/api', reviewRoutes);`
   - Run `npm run swagger` to update docs
2. **New upload type**: Copy `middlewares/productUpload.js`, change `folder` param
3. **Admin endpoint**: Always use `router.post('/admin/resource', authMiddleware, adminMiddleware, handler)`

## Project-Specific Quirks
- **Nodemon config**: `elegant_be/nodemon.json` may have custom watch paths
- **Static serving**: `/uploads` route serves local files directly via `express.static("uploads")`
- **Dual package.json**: Root has payment/SMS deps (Razorpay, Twilio), `elegant_be/` has core server deps
- **Swagger conditional**: `server.js` only loads Swagger JSON in production to reduce boot time
- **Mail service**: `mailService.js` placeholder (contains `// aaa?`); integrate SendGrid/Nodemailer if needed

## Environment Variables Required
```
DB_HOST, DB_USER, DB_NAME, DB_PASS
JWT_SECRET
CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
PORT (default 8080)
NODE_ENV (production/development)
```