import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/user.route';
import accountRouter from './routes/account.route';
import accountTypeRouter from './routes/account-type.route';
import incomeRouter from './routes/income.route';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use('/api/users', userRouter);
app.use('/api/accounts/account-type', accountTypeRouter);
app.use('/api/accounts', accountRouter);
app.use('/api/incomes', incomeRouter);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});