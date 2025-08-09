const db = require('../config/db');

// Utility to send consistent response
const sendResponse = (res, status, success, message, data = null) => {
    return res.status(status).json({ success, message, data });
};


exports.getAddressesByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch addresses
        const [addresses] = await db.query(
            "SELECT id, title, address, is_default, created_at, updated_at FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC",
            [userId]
        );

        if (addresses.length === 0) {
            return sendResponse(res, 404, false, "No addresses found for this user");
        }

        // Format is_default as boolean
        const formattedAddresses = addresses.map(addr => ({
            id: addr.id,
            title: addr.title,
            address: addr.address,
            is_default: addr.is_default === 1, // true/false
            created_at: addr.created_at,
            updated_at: addr.updated_at
        }));

        return sendResponse(res, 200, true, "Addresses fetched successfully", formattedAddresses);
    } catch (error) {
        console.error("Get Addresses by UserId Error:", error);
        return sendResponse(res, 500, false, "Server error");
    }
};
// Add Address
exports.addAddress = async (req, res) => {
    try {
        const { title, address, is_default } = req.body;
        const userId = req.user.id;

        if (!title || !address) {
            return sendResponse(res, 400, false, "Title and address are required");
        }

        // Convert to 1/0
        const defaultFlag = Number(is_default) === 1 ? 1 : 0;

        // If defaultFlag = 1, remove old default
        if (defaultFlag === 1) {
            await db.query(
                "UPDATE addresses SET is_default = 0 WHERE user_id = ?",
                [userId]
            );
        }

        const [result] = await db.query(
            "INSERT INTO addresses (user_id, title, address, is_default) VALUES (?, ?, ?, ?)",
            [userId, title, address, defaultFlag]
        );

        const [newAddress] = await db.query(
            "SELECT * FROM addresses WHERE id = ?",
            [result.insertId]
        );

        return sendResponse(res, 201, true, "Address added successfully", newAddress[0]);
    } catch (error) {
        console.error("Add Address Error:", error);
        return sendResponse(res, 500, false, "Server error");
    }
};

// Get All Addresses
exports.getAddresses = async (req, res) => {
    try {
        const userId = req.user.id;

        const [addresses] = await db.query(
            "SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC",
            [userId]
        );

        return sendResponse(res, 200, true, "Addresses fetched successfully", addresses);
    } catch (error) {
        console.error("Get Addresses Error:", error);
        return sendResponse(res, 500, false, "Server error");
    }
};

// Update Address (including default handling)
exports.updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, address, is_default } = req.body;
        const userId = req.user.id;

        const [existing] = await db.query(
            "SELECT * FROM addresses WHERE id = ? AND user_id = ?",
            [id, userId]
        );
        if (existing.length === 0) {
            return sendResponse(res, 404, false, "Address not found");
        }

        const defaultFlag = Number(is_default) === 1 ? 1 : 0;

        if (defaultFlag === 1) {
            await db.query(
                "UPDATE addresses SET is_default = 0 WHERE user_id = ?",
                [userId]
            );
        }

        await db.query(
            "UPDATE addresses SET title = ?, address = ?, is_default = ? WHERE id = ? AND user_id = ?",
            [
                title || existing[0].title,
                address || existing[0].address,
                defaultFlag,
                id,
                userId
            ]
        );

        const [updated] = await db.query(
            "SELECT * FROM addresses WHERE id = ?",
            [id]
        );

        return sendResponse(res, 200, true, "Address updated successfully", updated[0]);
    } catch (error) {
        console.error("Update Address Error:", error);
        return sendResponse(res, 500, false, "Server error");
    }
};

// Delete Address
exports.deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Check if exists
        const [existing] = await db.query(
            "SELECT * FROM addresses WHERE id = ? AND user_id = ?",
            [id, userId]
        );
        if (existing.length === 0) {
            return sendResponse(res, 404, false, "Address not found");
        }

        await db.query("DELETE FROM addresses WHERE id = ? AND user_id = ?", [id, userId]);

        return sendResponse(res, 200, true, "Address deleted successfully", existing[0]);
    } catch (error) {
        console.error("Delete Address Error:", error);
        return sendResponse(res, 500, false, "Server error");
    }
};
