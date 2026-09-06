import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import syncRouter from "./sync";
import partnerRouter from "./partner";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(syncRouter);
router.use(partnerRouter);

export default router;
