import { Router } from "express";
import { networkController } from "../controllers/network.controller";

const router = Router();

router.get("/", networkController.getAll);
router.get("/:name", networkController.getByName);
router.post("/", networkController.create);
router.put("/:name", networkController.update);
router.delete("/:name", networkController.delete);

export default router;
