const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');

const CSV_PATH = path.join(__dirname, '..', 'data', 'customers.csv');

const HEADERS = [
  { id: 'name', title: 'name' },
  { id: 'phone', title: 'phone' },
  { id: 'email', title: 'email' },
  { id: 'message_status', title: 'message_status' },
  { id: 'response', title: 'response' },
  { id: 'response_timestamp', title: 'response_timestamp' },
  { id: 'token', title: 'token' },
];

function readCustomers() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(CSV_PATH)
      .pipe(csvParser())
      .on('data', (row) => results.push(row))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

async function writeCustomers(customers) {
  const writer = createObjectCsvWriter({ path: CSV_PATH, header: HEADERS });
  await writer.writeRecords(customers);
}

async function updateCustomer(matchFn, updates) {
  const customers = await readCustomers();
  const customer = customers.find(matchFn);
  if (customer) {
    Object.assign(customer, updates);
    await writeCustomers(customers);
  }
  return customer;
}

module.exports = { readCustomers, writeCustomers, updateCustomer };
