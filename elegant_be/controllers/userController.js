const db = require("../config/db");

exports.getUserById = async (req, res) => {
    const userId = req.user.id;

  try {
const [rows] = await db.query(
  'SELECT id, name, email, phone, profile_pic, is_verified, created_at FROM users WHERE id = ?',
  [userId]
);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  if (rows[0].profile_pic) {
      rows[0].profile_pic = `${rows[0].profile_pic}`;
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
  const userId = req.user.id;
  const { name, email, phone } = req.body;
  const newProfilePic = req.file ? req.file.path : null;

  try {
    // Pehle purana user data nikal lo
    const [existingUser] = await db.query(
      `SELECT profile_pic FROM users WHERE id = ?`,
      [userId]
    );

    if (!existingUser || existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Agar naya profile pic hai toh use lo, warna purana rakho
    const profile_pic = newProfilePic || existingUser[0].profile_pic;

    // Update query
    const [result] = await db.query(
      `UPDATE users 
       SET name = ?, email = ?, phone = ?, profile_pic = ?, updated_at = NOW() 
       WHERE id = ?`,
      [name, email, phone, profile_pic, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: "No changes made",
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
          profile_pic,
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
