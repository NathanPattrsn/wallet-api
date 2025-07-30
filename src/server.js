import express from 'express';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import transactionsRoute from './routes/transactionsRoute.js';
import job from './config/cron.js';
import cors from 'cors';

dotenv.config();

const app = express();

if (process.env.NODE_ENV==="production") job.start();

// Enable CORS for all origins (for testing)
app.use(cors());

// Optional: more strict for production
// app.use(cors({ origin: 'http://localhost:8081', credentials: true }));

// middleware
app.use(rateLimiter);
app.use(express.json());

// our custom middleware to log requests
// app.use((req,res,next) => {
//     console.log("Hey we hit a request, the method is:", req.method);
//     next();
// });

const PORT = process.env.PORT || 5001;

app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});

app.use("/api/transactions", transactionsRoute);

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});