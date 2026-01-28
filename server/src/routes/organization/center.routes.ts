import { Router } from "express";
import { centerController } from "../../controllers/organization/center.controller";

const router = Router();

router.get("/", centerController.getAll);
router.get("/:name", centerController.getByName);
router.post("/", centerController.create);
router.put("/:name", centerController.update);
router.delete("/:name", centerController.delete);

export default router;
