# Copilot Instructions for elegant_project

## Project Overview
- This is a Node.js backend (see `elegant_be/`) for an e-commerce platform, organized by feature and responsibility.
- Main entry points: `elegant_be/app.js` (application setup), `elegant_be/server.js` (server startup).
- API routes are defined in `elegant_be/routes/`, grouped by resource (e.g., `userRoutes.js`, `productRoutes.js`).
- Controllers in `elegant_be/controllers/` handle business logic for each resource.
- Middleware in `elegant_be/middlewares/` for authentication, file uploads, and request processing.
- Services (e.g., `mailService.js`) encapsulate integrations (email, cloud storage).
- Configuration files in `elegant_be/config/` for database, cloudinary, multer, etc.
- Static uploads are stored in `elegant_be/uploads/` (organized by type).
- Utilities in `elegant_be/utils/` for token generation and email sending.

## Developer Workflows
- Start server: `node elegant_be/server.js` (or use `npm start` if defined in `package.json`).
- No explicit test or build scripts found; add them to `package.json` if needed.
- Debugging: Use console logging in controllers/services; middleware can intercept requests for inspection.
- API documentation: See `elegant_be/swagger.js` and `swagger-output.json` for OpenAPI spec generation.

## Project-Specific Patterns
- Route files import controllers and middleware explicitly; follow this pattern for new resources.
- Controllers expect validated input; validation should be handled in middleware or at route level.
- File uploads use custom middleware (`productUpload.js`, `uploadCategoryIcon.js`, etc.) and store files in organized subfolders under `uploads/`.
- Token-based authentication via `authMiddleware.js` and `generateToken.js`.
- External services (Cloudinary, email) are configured in `config/` and used via service modules.
- Use feature-based organization: add new resources with matching controller, route, and (if needed) middleware/service files.

## Integration Points
- Database config: `config/db.js` (likely MongoDB or similar; check file for details).
- Cloudinary integration: `config/cloudinary.js` and related upload middleware.
- Email: `services/mailService.js` and `utils/sendMail.js`.
- API documentation: `swagger.js` generates `swagger-output.json`.

## Examples
- To add a new resource (e.g., reviews): create `controllers/reviewController.js`, `routes/reviewRoutes.js`, and update `app.js` to include the new route.
- To add middleware: place in `middlewares/`, import in relevant route file, and add to route definition.

## Conventions
- Use ES6 module syntax and async/await for async operations.
- Organize code by feature, not by type (keep controllers, routes, middleware for each resource together).
- Store static files in `uploads/` subfolders by type.
- Keep configuration and secrets out of source code (use environment variables).

---

For questions or unclear patterns, review the referenced files or ask for clarification. Update this guide as new conventions emerge.