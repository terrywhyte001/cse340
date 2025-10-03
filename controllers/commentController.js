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
};

/* *****************************
 * Handle comment like
 * ***************************** */
commentController.likeComment = async function (req, res) {
  const { comment_id } = req.params;
  const account_id = res.locals.accountData.account_id;
  
  try {
    // Check if user has already liked the comment
    const hasLiked = await commentModel.hasUserLikedComment(comment_id, account_id);
    const comment = await commentModel.getCommentById(comment_id);
    
    if (!comment) {
      req.flash("notice", "Comment not found.");
      return res.redirect("/");
    }

    if (hasLiked) {
      await commentModel.unlikeComment(comment_id, account_id);
      req.flash("notice", "Like removed.");
    } else {
      await commentModel.likeComment(comment_id, account_id);
      req.flash("notice", "Comment liked!");
    }

    res.redirect(`/inv/detail/${comment.inv_id}`);
  } catch (error) {
    console.error("Error in likeComment controller:", error);
    req.flash("notice", "Error processing like/unlike.");
    res.redirect("/");
  }
};

module.exports = commentController;
