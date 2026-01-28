import { Router } from "express";
import { projectController } from "../../controllers/request/project.controller";

const router = Router();

router.get("/", projectController.getAll);
router.get("/:name", projectController.getByName);
router.post("/", projectController.create);
router.put("/:name", projectController.update);
router.delete("/:name", projectController.delete);

export default router;
