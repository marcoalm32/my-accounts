import { Router } from "express";
import { AccountTypeController } from "../controllers/account-type.controller";
import { AccountTypeService } from "../services/account-type.service";
import { isAuthenticated } from "../shared/middlewares/authenticated";

const router = Router();
const accountTypeService = new AccountTypeService();
const accountTypeController = new AccountTypeController(accountTypeService);

router.get('/', isAuthenticated, (req, res) => accountTypeController.find(req, res));
router.post('/', isAuthenticated, (req, res) => accountTypeController.create(req, res));
router.patch('/:id', isAuthenticated, (req, res) => accountTypeController.update(req, res));
router.delete('/:id', isAuthenticated, (req, res) => accountTypeController.delete(req, res));
router.get('/:id', isAuthenticated, (req, res) => accountTypeController.findById(req, res));

export default router;