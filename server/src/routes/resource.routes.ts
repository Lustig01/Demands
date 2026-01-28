import { Router } from "express";
import { resourceController } from "../controllers/resource.controller";

const router = Router();

router.get("/", resourceController.getAll);
router.get("/service/:serviceName", resourceController.getByService);
router.get("/:serviceName/:name", resourceController.getByKey);
router.post("/", resourceController.create);
router.put("/:serviceName/:name", resourceController.update);
router.delete("/:serviceName/:name", resourceController.delete);

export default router;
