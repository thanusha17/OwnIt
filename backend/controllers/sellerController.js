import db from '../db.js';
import {sendEmail} from '../utils/sendEmail.js';

export const addNewPurchase = async (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      product_name,
      invoice_number,
      purchase_date,
      warranty_period
    } = req.body;

    // Basic validation
    if (!customer_name || !customer_email || !product_name || !invoice_number || !purchase_date || !warranty_period) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const [customer] = await db.promise().query(
    'SELECT id FROM users WHERE email = ?',
    [customer_email]
    );

    if (customer.length === 0) {
    return res.status(404).json({ message: 'Customer not found' });
    }

    const customer_id = customer[0].id;

    // Save to DB
    await db.promise().query(
      'INSERT INTO purchases (customer_name, customer_email, product, invoice_no, purchase_date, warranty_period, seller_id, customer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [customer_name, customer_email, product_name, invoice_number, purchase_date, warranty_period, req.user.id, customer_id]
    );

    // Send confirmation email
    const emailContent = `
      <h3>Thank you for your purchase!</h3>
      <p>Product: ${product_name}</p>
      <p>Invoice Number: ${invoice_number}</p>
      <p>Warranty: ${warranty_period} months</p>
    `;

    await sendEmail({
      to: customer_email,
      subject: 'Purchase Confirmation',
      html: emailContent
    });

    res.status(201).json({ message: 'Purchase recorded and email sent!' });
  } catch (err) {
    console.error('Add Purchase Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSellerPurchases = async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM purchases WHERE seller_id = ? ORDER BY purchase_date DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Fetch Purchases Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

