# Customer Outreach & Response Tracker

A CSV-based customer outreach and response tracking system built with Node.js and Express. Send personalized SMS and email messages to customers, collect YES/NO responses via web links or SMS replies, and monitor everything from a real-time dashboard.

## Features

- **Bulk Outreach** — Send SMS (Twilio) and email (Nodemailer) to customers from a CSV file
- **Web Response** — Unique per-customer links with YES/NO buttons
- **SMS Response** — Twilio webhook processes inbound SMS replies
- **Live Dashboard** — Auto-refreshing table with summary stats (total, sent, responded, pending)
- **CSV Persistence** — All data stored in `data/customers.csv`

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

| Variable | Description |
|---|---|
| `TWILIO_ACCOUNT_SID` | Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token |
| `TWILIO_PHONE_NUMBER` | Twilio phone number (e.g. `+1234567890`) |
| `SMTP_HOST` | SMTP server host |
| `SMTP_PORT` | SMTP server port |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |
| `EMAIL_FROM` | Sender email address |
| `BASE_URL` | Public URL for response links (default: `http://localhost:3000`) |
| `PORT` | Server port (default: `3000`) |

### 3. Prepare customer data

Edit `data/customers.csv` with your customer list:

```csv
name,phone,email,message_status,response,response_timestamp,token
Alice Johnson,+15551234567,alice@example.com,,,,,
Bob Smith,+15559876543,bob@example.com,,,,,
```

### 4. Start the server

```bash
node server.js
```

Visit `http://localhost:3000` to view the dashboard.

## Usage

1. Open the dashboard at `http://localhost:3000`
2. Click **Send Outreach** to send SMS and email to all unsent customers
3. Customers click their unique link and select YES or NO, or reply to the SMS
4. The dashboard updates automatically every 30 seconds

## Project Structure

```
├── server.js              # Express app entry point
├── data/customers.csv     # Customer data (input/output)
├── lib/
│   ├── csv.js             # CSV read/write helpers
│   ├── sms.js             # Twilio SMS sending
│   └── email.js           # Nodemailer email sending
├── routes/
│   ├── dashboard.js       # GET / — dashboard
│   ├── outreach.js        # POST /send — trigger outreach
│   ├── response.js        # GET/POST /respond/:token — web response
│   └── webhook.js         # POST /webhook/sms — Twilio inbound SMS
├── views/
│   ├── dashboard.ejs      # Dashboard template
│   └── respond.ejs        # Response page template
└── public/
    └── style.css          # Styling
```
