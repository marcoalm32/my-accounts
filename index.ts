import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/user.route';
import accountRouter from './routes/account.route';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use('/api/users', userRouter);
app.use('/api/account', accountRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});