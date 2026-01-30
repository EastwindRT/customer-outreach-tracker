const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { readCustomers, writeCustomers } = require('../lib/csv');
const { sendSMS } = require('../lib/sms');
const { sendEmail } = require('../lib/email');

// In-memory token→phone mapping (shared via app.locals in server.js)
router.post('/send', async (req, res) => {
  try {
    const customers = await readCustomers();
    const tokenMap = req.app.locals.tokenMap;
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    for (const customer of customers) {
      if (customer.message_status === 'sent') continue;

      const token = uuidv4();
      customer.token = token;
      customer.message_status = 'sent';
      tokenMap.set(token, customer.phone);

      const responseLink = `${baseUrl}/respond/${token}`;
      const messageBody = `Hi ${customer.name}, we'd love your feedback! Please respond YES or NO: ${responseLink}`;
      const emailHtml = `<p>Hi ${customer.name},</p>
        <p>We'd love your feedback! Please click one of the links below:</p>
        <p><a href="${responseLink}">Respond here</a></p>
        <p>Or reply YES or NO to the SMS we sent.</p>`;

      try {
        await sendSMS(customer.phone, messageBody);
      } catch (err) {
        console.error(`SMS failed for ${customer.name}:`, err.message);
      }

      try {
        await sendEmail(customer.email, 'We value your feedback!', emailHtml);
      } catch (err) {
        console.error(`Email failed for ${customer.name}:`, err.message);
      }
    }

    await writeCustomers(customers);
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error sending outreach: ' + err.message);
  }
});

module.exports = router;
