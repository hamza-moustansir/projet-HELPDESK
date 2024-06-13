const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  deleteUser,
  getUserStats,
  getAgentRanking,
} = require('../controllers/userController');


const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/', getUsers);
router.get('/stats', getUserStats); // Nouvelle route pour obtenir les statistiques des utilisateurs
router.delete('/:id', deleteUser);
router.get('/agentRanking', getAgentRanking);

module.exports = router;
