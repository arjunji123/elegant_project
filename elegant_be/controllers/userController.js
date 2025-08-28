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
      const profile_pic = req.file ? req.file.path : null;

  try {
const [result] = await db.query(
  `UPDATE users 
   SET name = ?, email = ?, phone = ?, profile_pic = ?, updated_at = NOW() 
   WHERE id = ?`,
  [name, email, phone, profile_pic, userId]
);


    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found or no changes made",
      });
    }
console.log(userId);

   return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: {
        user_id: userId,
        updated_fields: {
          name,
          email,
          phone,
          profile_pic 
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