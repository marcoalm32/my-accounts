import { Router } from "express";
import { BalanceController } from "../controllers/balance.controller";
import { isAuthenticated } from "../shared/middlewares/authenticated";
import { BalanceService } from "../services/balance.service";

const router = Router();
const balanceService = new BalanceService();
const balanceController = new BalanceController(balanceService);

router.get("/", isAuthenticated, (req, res) => balanceController.find(req, res));

export default router;