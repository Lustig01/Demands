import { Router } from "express";
import { serviceController } from "../../controllers/service/service.controller";

const router = Router();

router.get("/", serviceController.getAll);
router.get("/:name", serviceController.getByName);
router.post("/", serviceController.create);
router.put("/:name", serviceController.update);
router.delete("/:name", serviceController.delete);

export default router;
