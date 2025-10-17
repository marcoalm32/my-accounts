import { Router } from "express";
import { IncomeController } from "../controllers/income.controller";
import { IncomeService } from "../services/income.service";
import { isAuthenticated } from "../shared/middlewares/authenticated";

const router = Router();
const incomeService = new IncomeService();
const incomeController = new IncomeController(incomeService);

router.get('/', isAuthenticated, (req, res) => incomeController.find(req, res));
router.post('/', isAuthenticated, (req, res) => incomeController.create(req, res));
router.patch('/:id', isAuthenticated, (req, res) => incomeController.update(req, res));
router.delete('/:id', isAuthenticated, (req, res) => incomeController.delete(req, res));
router.get('/:id', isAuthenticated, (req, res) => incomeController.findById(req, res));

export default router;