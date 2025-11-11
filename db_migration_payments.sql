-- Create payment_intents table
CREATE TABLE IF NOT EXISTS payment_intents (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    razorpay_order_id TEXT UNIQUE NOT NULL,
    razorpay_payment_id TEXT,
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'INR',
    purpose TEXT NOT NULL,
    status TEXT DEFAULT 'created',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payment_intents_user_id ON payment_intents(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_intents_status ON payment_intents(status);
CREATE INDEX IF NOT EXISTS idx_payment_intents_razorpay_order_id ON payment_intents(razorpay_order_id);

-- Verify the table was created
SELECT name FROM sqlite_master WHERE type='table' AND name='payment_intents';
