const Article = require('../models/articleModel');
const asyncHandler = require('express-async-handler');

// Créer un nouvel article
const createArticle = asyncHandler(async (req, res) => {
  const { title, content, author } = req.body;
  const article = new Article({ title, content, author });
  await article.save();
  res.status(201).json(article);
});

// Mettre à jour un article
const updateArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, lastUpdatedBy } = req.body;
  const article = await Article.findById(id);
  if (!article) {
    res.status(404);
    throw new Error('Article not found');
  }
  article.title = title;
  article.content = content;
  article.lastUpdatedBy = lastUpdatedBy;
  await article.save();
  res.json(article);
});

// Supprimer un article
const deleteArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const article = await Article.findById(id);
  if (!article) {
    res.status(404);
    throw new Error('Article not found');
  }
  await article.remove();
  res.json({ message: 'Article removed' });
});

// Consulter un article
const getArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const article = await Article.findById(id).populate('author').populate('lastUpdatedBy');
  if (!article) {
    res.status(404);
    throw new Error('Article not found');
  }
  res.json(article);
});

// Lister tous les articles
const getArticles = asyncHandler(async (req, res) => {
  const articles = await Article.find().populate('author').populate('lastUpdatedBy');
  res.json(articles);
});



module.exports = {
  createArticle,
  updateArticle,
  deleteArticle,
  getArticle,
  getArticles,
};
