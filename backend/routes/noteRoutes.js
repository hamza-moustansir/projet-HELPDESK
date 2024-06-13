const express = require('express')
const router = express.Router({ mergeParams: true })
const { getNotes, createNote,deleteNote  } = require('../controllers/noteController')

const { protect } = require('../middleware/authMiddleware')

router.route('/').get(getNotes).post(createNote)
router.route('/:id').delete(deleteNote);

module.exports = router
