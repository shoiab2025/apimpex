import { Router } from "express";
import { listDeliveryAgentsWithOrders, getDeliveryAgentWithOrders } from "../controllers/deliveryAgent.controller.js";

const router = Router();

router.get("/", listDeliveryAgentsWithOrders);
router.get("/:id", getDeliveryAgentWithOrders); 

export default router;
