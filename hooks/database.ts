import * as SQLite from 'expo-sqlite';

export type User = {
  id: number;
  email: string;
  password: string;
};

const db = SQLite.openDatabaseSync(':memory:'); 

// Initialize Database
export const initializeDatabase = (): void => {
  db.runSync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `);

  db.runSync(`
    CREATE TABLE IF NOT EXISTS trades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      crypto_name TEXT,
      amount REAL,
      trade_type TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.runSync(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      full_name TEXT,
      bio TEXT
    );
  `);

  db.runSync(`
    CREATE TABLE IF NOT EXISTS assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      crypto_name TEXT,
      amount REAL
    );
  `);

  console.log('In-memory database initialized');
};

// SignUp User
export const signupUser = (
  email: string,
  password: string,
  callback: (success: boolean, message: string) => void
) => {
  const checkQuery = 'SELECT * FROM users WHERE email = ?';
  const existingUser = db.getAllSync(checkQuery, [email]);

  if (existingUser && existingUser.length > 0) {
    callback(false, 'Email already exists');
    return;
  }

  const insertQuery = 'INSERT INTO users (email, password) VALUES (?, ?)';
  try {
    const result = db.runSync(insertQuery, [email, password]);

    if (result.changes > 0) {
      callback(true, 'Signup successful!');
    } else {
      callback(false, 'Signup failed');
    }
  } catch (error) {
    console.error('Error during signup:', error);
    callback(false, 'Signup failed');
  }
};

// Login User
export const loginUser = (
  email: string,
  password: string,
  callback: (success: boolean, message: string) => void,
  login: (userId: number) => void 
) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  const user = db.getFirstSync(query, [email]);

  if (!user) {
    callback(false, 'User not found');
    return;
  }

  if (user.password === password) {
    login(user.id); 
    callback(true, 'Login successful!');
  } else {
    callback(false, 'Incorrect password');
  }
};

// Add Asset 
export const addOrUpdateAsset = (userId: number, cryptoName: string, amount: number) => {
  const checkQuery = 'SELECT * FROM assets WHERE user_id = ? AND crypto_name = ?';
  const existingAsset = db.getFirstSync(checkQuery, [userId, cryptoName]);
  if (existingAsset) {
    const updateQuery = 'UPDATE assets SET amount = amount + ? WHERE user_id = ? AND crypto_name = ?';
    db.runSync(updateQuery, [amount, userId, cryptoName]);
  } else {

    const insertQuery = 'INSERT INTO assets (user_id, crypto_name, amount) VALUES (?, ?, ?)';
    db.runSync(insertQuery, [userId, cryptoName, amount]);
  }
};

// Add Transaction (Buy/Sell)
export const addTransaction = (userId: number, cryptoName: string, amount: number, tradeType: string) => {
  const insertQuery = 'INSERT INTO trades (user_id, crypto_name, amount, trade_type) VALUES (?, ?, ?, ?)';
  db.runSync(insertQuery, [userId, cryptoName, amount, tradeType]);
};

// Get User's Assets
export const getUserAssets = (userId: number) => {
  const query = 'SELECT crypto_name, amount FROM assets WHERE user_id = ?';
  return db.getAllSync(query, [userId]);
};

// Get User's Last Transaction
export const getLastTransaction = (userId: number) => {
  const query = `
    SELECT * FROM trades
    WHERE user_id = ?
    ORDER BY timestamp DESC
    LIMIT 1
  `;
  return db.getFirstSync(query, [userId]);
};

// Handle Buy and Sell Logic (Update Portfolio)
export const handleBuy = (userId: number, cryptoName: string, price: number, amount: number) => {
  addOrUpdateAsset(userId, cryptoName, amount);
  addTransaction(userId, cryptoName, amount, 'buy');
};

export const handleSell = (userId: number, cryptoName: string, price: number, amount: number) => {
  addOrUpdateAsset(userId, cryptoName, -amount);
  addTransaction(userId, cryptoName, amount, 'sell');
};
