const express = require('express');
const router = express.Router();

const {
  getAllLoans,
  getLoanById,
  createLoan,
  updateLoan,
  deleteLoan,
} = require('../controllers/loansController');

router.get('/', getAllLoans);
router.get('/:id', getLoanById);
router.post('/', createLoan);
router.put('/:id', updateLoan);
router.patch('/:id', updateLoan);
router.delete('/:id', deleteLoan);

module.exports = router;