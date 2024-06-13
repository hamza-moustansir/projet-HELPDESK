const express = require('express');
const router = express.Router();
const {
  createArticle,
  updateArticle,
  deleteArticle,
  getArticle,
  getArticles,
} = require('../controllers/articleController');

router.route('/').post(createArticle).get(getArticles);
router.route('/:id').get(getArticle).put(updateArticle).delete(deleteArticle);

module.exports = router;
