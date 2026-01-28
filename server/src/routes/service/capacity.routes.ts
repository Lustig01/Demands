import { Router } from "express";
import { capacityController } from "../../controllers/service/capacity.controller";

const router = Router();

router.get("/", capacityController.getAll);
router.get("/location/:locationId", capacityController.getByLocation);
router.get("/resource/:serviceName/:resourceName", capacityController.getByResource);
router.get("/:id", capacityController.getById);
router.post("/", capacityController.create);
router.put("/:id", capacityController.update);
router.delete("/:id", capacityController.delete);

export default router;
