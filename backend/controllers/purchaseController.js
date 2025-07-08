import db from '../db.js';

export const getUserPurchases = async (req, res) => {
  try {
    const userId = req.user.id;

    const [purchases] = await db.promise().query(
      'SELECT * FROM purchases WHERE customer_id = ? ORDER BY purchase_date DESC',
      [userId]
    );

    res.status(200).json(purchases);
  } catch (error) {
    console.error('Get Purchases Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch purchases' });
  }
};
