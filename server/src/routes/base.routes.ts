import { Router } from "express";
import { baseController } from "../controllers/base.controller";

const router = Router();

router.get("/", baseController.getAll);
router.get("/:name", baseController.getByName);
router.post("/", baseController.create);
router.put("/:name", baseController.update);
router.delete("/:name", baseController.delete);

export default router;
