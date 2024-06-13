const asyncHandler = require('express-async-handler')

const Note = require('../models/noteModel')

// @route   GET /api/notes/
// Lister tous les notes
const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

// @route   POST /api/notes/
// Créer un nouvel note
const createNote = asyncHandler(async (req, res) => {
  const { email, service, content } = req.body;
  const note = new Note({ email, service, content });
  await note.save();
  res.status(201).json(note);
});

// Supprimer un note
const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const note = await Note.findById(id);
  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }
  await note.remove();
  res.json({ message: 'Note removed' });
});


module.exports = {
  getNotes,
  deleteNote ,
  createNote,
}
