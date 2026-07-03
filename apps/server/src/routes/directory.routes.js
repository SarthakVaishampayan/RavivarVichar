const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');

const entrepreneurCtrl = require('../controllers/entrepreneur.controller');
const shgCtrl = require('../controllers/shg.controller');
const mentorCtrl = require('../controllers/mentor.controller');

// Entrepreneur routes
router.get('/entrepreneurs', entrepreneurCtrl.getAll);
router.get('/entrepreneurs/:id', entrepreneurCtrl.getOne);
router.post('/entrepreneurs', protect, entrepreneurCtrl.create);
router.put('/entrepreneurs/:id', protect, entrepreneurCtrl.update);
router.delete('/entrepreneurs/:id', protect, entrepreneurCtrl.deleteOne);

// SHG routes
router.get('/shgs', shgCtrl.getAll);
router.get('/shgs/:id', shgCtrl.getOne);
router.post('/shgs', protect, shgCtrl.create);
router.put('/shgs/:id', protect, shgCtrl.update);
router.delete('/shgs/:id', protect, shgCtrl.deleteOne);

// Mentor routes
router.get('/mentors', mentorCtrl.getAll);
router.get('/mentors/:id', mentorCtrl.getOne);
router.post('/mentors', protect, mentorCtrl.create);
router.put('/mentors/:id', protect, mentorCtrl.update);
router.delete('/mentors/:id', protect, mentorCtrl.deleteOne);

module.exports = router;
