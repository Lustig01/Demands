import { Router } from "express";
import { locationController } from "../../controllers/location/location.controller";

const router = Router();

router.get("/", locationController.getAll);
router.get("/filter", locationController.getByFilters);
router.get("/composite/:baseName/:environmentName/:networkName", locationController.getByComposite);
router.get("/:id", locationController.getById);
router.post("/", locationController.create);
router.put("/:id", locationController.update);
router.delete("/:id", locationController.delete);

export default router;
