const express = require('express');
const router = express.Router();
const { updateCustomer } = require('../lib/csv');

router.get('/respond/:token', (req, res) => {
  const tokenMap = req.app.locals.tokenMap;
  const phone = tokenMap.get(req.params.token);

  if (!phone) {
    return res.status(404).send('Invalid or expired link.');
  }

  res.render('respond', { token: req.params.token });
});

router.post('/respond/:token', async (req, res) => {
  const tokenMap = req.app.locals.tokenMap;
  const token = req.params.token;
  const phone = tokenMap.get(token);

  if (!phone) {
    return res.status(404).send('Invalid or expired link.');
  }

  const choice = req.body.choice;
  if (choice !== 'YES' && choice !== 'NO') {
    return res.status(400).send('Invalid response.');
  }

  await updateCustomer(
    (c) => c.token === token,
    { response: choice, response_timestamp: new Date().toISOString() }
  );

  res.send(`<h2>Thank you for your response: ${choice}</h2><p>You may close this page.</p>`);
});

module.exports = router;
