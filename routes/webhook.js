const express = require('express');
const router = express.Router();
const { readCustomers, updateCustomer } = require('../lib/csv');

router.post('/webhook/sms', async (req, res) => {
  const from = req.body.From;
  const body = (req.body.Body || '').trim().toUpperCase();

  let replyText = 'Sorry, we could not process your response. Please reply YES or NO.';

  if (body === 'YES' || body === 'NO') {
    const customer = await updateCustomer(
      (c) => c.phone === from,
      { response: body, response_timestamp: new Date().toISOString() }
    );

    if (customer) {
      replyText = `Thank you for your response: ${body}`;
    }
  }

  res.set('Content-Type', 'text/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response><Message>${replyText}</Message></Response>`);
});

module.exports = router;
