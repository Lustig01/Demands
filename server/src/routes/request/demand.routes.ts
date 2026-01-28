import { Router } from "express";
import { demandController } from "../../controllers/request/demand.controller";

const router = Router();

router.get("/", demandController.getAll);
router.get("/filter", demandController.getByFilters);
router.get("/:id", demandController.getById);
router.post("/", demandController.create);
router.patch("/:id", demandController.update);
router.delete("/:id", demandController.delete);
router.patch("/:id/reject", demandController.reject);
router.patch("/:id/approve", demandController.approve);

export default router;
