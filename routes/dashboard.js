const express = require('express');
const router = express.Router();
const { readCustomers } = require('../lib/csv');

router.get('/', async (req, res) => {
  try {
    const customers = await readCustomers();
    const total = customers.length;
    const sent = customers.filter((c) => c.message_status === 'sent').length;
    const responded = customers.filter((c) => c.response).length;
    const pending = sent - responded;

    res.render('dashboard', { customers, stats: { total, sent, responded, pending } });
  } catch (err) {
    res.status(500).send('Error loading dashboard: ' + err.message);
  }
});

module.exports = router;
