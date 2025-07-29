import express from 'express';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import transactionsRoute from './routes/transactionsRoute.js';

dotenv.config();

const app = express();

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
    res.send("Working!");
});

app.use("/api/transactions", transactionsRoute);

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});