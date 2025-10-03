const pool = require("../database/");

/* *****************************
 * Add a new comment
 * ***************************** */
async function addComment(comment_text, inv_id, account_id) {
  try {
    const sql = `
      INSERT INTO comments (comment_text, inv_id, account_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await pool.query(sql, [comment_text, inv_id, account_id]);
    return result.rows[0];
  } catch (error) {
    console.error("addComment error:", error);
    throw error;
  }
}

/* *****************************
 * Get all comments for a specific vehicle
 * ***************************** */
async function getCommentsByVehicleId(inv_id) {
  try {
    const result = await pool.query(
      `SELECT c.comment_id, c.comment_text, c.comment_date, c.account_id, a.account_firstname, a.account_lastname
         FROM comments c
         JOIN account a ON c.account_id = a.account_id
         WHERE c.inv_id = $1
         ORDER BY c.comment_date DESC`,
      [inv_id]
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

/* *****************************
 * Get comments by comment ID
 * ***************************** */
async function getCommentById(commentId) {
  try {
    const result = await pool.query(
      "SELECT * FROM comments WHERE comment_id = $1",
      [commentId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("getCommentById error", error);
  }
}

/* *****************************
 * Delete comment
 * ***************************** */
async function deleteComment(commentId) {
  try {
    const result = await pool.query(
      "DELETE FROM comments WHERE comment_id = $1",
      [commentId]
    );
    return result.rowCount;
  } catch (error) {
    console.error("deleteComment error", error);
  }
}

module.exports = {
  addComment,
  getCommentsByVehicleId,
  getCommentById,
  deleteComment,
};
