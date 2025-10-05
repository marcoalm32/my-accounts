import { Router } from "express";
import { AccountController } from "../controllers/account.controller";
import { AccountService } from "../services/account.service";
import { isAuthenticated } from "../shared/middlewares/authenticated";

const router = Router();
const accountService = new AccountService();
const accountController = new AccountController(accountService);

router.get('/', isAuthenticated, (req, res) => accountController.find(req, res));
router.post('/', isAuthenticated, (req, res) => accountController.create(req, res));
router.patch('/:id', isAuthenticated, (req, res) => accountController.update(req, res));
router.delete('/:id', isAuthenticated, (req, res) => accountController.delete(req, res));
router.get('/:id', isAuthenticated, (req, res) => accountController.findById(req, res));

export default router;