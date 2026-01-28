import { Router } from "express";
import { environmentController } from "../controllers/environment.controller";

const router = Router();

router.get("/", environmentController.getAll);
router.get("/:name", environmentController.getByName);
router.post("/", environmentController.create);
router.put("/:name", environmentController.update);
router.delete("/:name", environmentController.delete);

export default router;
