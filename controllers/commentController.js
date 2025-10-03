const commentModel = require("../models/comment-model");

const commentController = {};

/* *****************************
 * Handle comment submission
 * ***************************** */
commentController.submitComment = async function (req, res) {
  const { comment_text, inv_id } = req.body;
  const account_id = res.locals.accountData.account_id;

  const addedComment = await commentModel.addComment(
    comment_text,
    inv_id,
    account_id
  );
  if (addedComment) {
    req.flash("notice", "Your comment was added successfully.");
    res.redirect(`/inv/detail/${inv_id}`);
  }
};

/* *****************************
 * Handle comment deletion
 * ***************************** */
commentController.deleteComment = async function (req, res) {
  const commentId = req.params.commentId;
  const invId = req.query.invId;
  const accountId = res.locals.accountData.account_id;

  // Get the comment first
  const comment = await commentModel.getCommentById(commentId);

  if (comment.account_id !== accountId) {
    req.flash("notice", "You are not authorized to delete this comment.");
    return res.redirect(`/inv/detail/${invId}`);
  }

  const deleted = await commentModel.deleteComment(commentId);
  if (deleted) {
    req.flash("notice", "Comment deleted successfully.");
  } else {
    req.flash("notice", "Comment could not be deleted.");
  }

  res.redirect(`/inv/detail/${invId}`);
}

module.exports = commentController;
