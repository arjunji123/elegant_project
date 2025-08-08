const db = require("../config/db");

exports.getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const [rows] = await db.query('SELECT id, name, email,phone, is_verified, created_at FROM users WHERE id = ?', [userId]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: rows[0],
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.updateUserById = async (req, res) => {
  const userId = req.params.id;
  const { name, email, phone, password } = req.body;

  try {
 const [result] = await pool.query(
      `UPDATE users 
       SET name = ?, email = ?, phone = ?, password = ?, updated_at = NOW() 
       WHERE id = ?`,
      [name, email, phone, password, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found or no changes made",
      });
    }

   return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: {
        user_id: userId,
        updated_fields: {
          name,
          email,
          phone,
          password
        },
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};