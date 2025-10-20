import { Router } from "express";
import { BalanceController } from "../controllers/balance.controller";
import { isAuthenticated } from "../shared/middlewares/authenticated";
import { BalanceService } from "../services/balance.service";

const router = Router();
const balanceService = new BalanceService();
const balanceController = new BalanceController(balanceService);

router.get("/", isAuthenticated, (req, res) => balanceController.find(req, res));
router.get("/latest", isAuthenticated, (req, res) => balanceController.findLatest(req, res));

export default router;