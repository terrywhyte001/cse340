const express = require("express");
const router = new express.Router();
const commentController = require("../controllers/commentController");
const utilities = require("../utilities/");
const commentValidate = require("../utilities/comment-validation");

// Route to handle comment submission
router.post(
  "/add-comment",
  utilities.authMiddleware,
  commentValidate.commentRules(),
  commentValidate.checkCommentData,
  utilities.handleErrors(commentController.submitComment)
);

router.post(
  "/delete/:commentId",
  utilities.checkLogin,
  utilities.handleErrors(commentController.deleteComment)
);

module.exports = router;
