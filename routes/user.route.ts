import { UserController } from '../controllers/user.controller';
import { Router } from 'express';

const router = Router();
const userController = new UserController();

router.post('/register', (req, res) => userController.register(req, res));
router.post('/login', (req, res) => userController.login(req, res));