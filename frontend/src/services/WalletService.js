import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/wallet", // Your Fastify backend URL
  withCredentials: true, // if using cookies/session
});

// Get balance
export const getWalletBalance = () => API.get("/balance");

// Initiate deposit
export const initiateDeposit = (amount) => API.post("/deposit/initiate", { amount });

// Verify deposit
export const verifyDeposit = (data) => API.post("/deposit/verify", data);

// Get transactions
export const getTransactions = () => API.get("/transactions");
