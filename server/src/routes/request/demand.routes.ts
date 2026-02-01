import { Router } from "express";
import { demandController } from "../../controllers/request/demand.controller";
import { authenticate } from "../../middleware/openIdConnect";
import { requireAuth } from "../../middleware/authorization";

const router = Router();

router.get("/", authenticate, requireAuth, demandController.getAll);
router.get("/filter", authenticate, requireAuth, demandController.getByFilters);
router.get("/:id", authenticate, requireAuth, demandController.getById);
router.post("/", authenticate, requireAuth, demandController.create);
router.patch("/:id", authenticate, requireAuth, demandController.update);
router.delete("/:id", authenticate, requireAuth, demandController.delete);
router.patch("/:id/reject", authenticate, requireAuth, demandController.reject);
router.patch("/:id/approve", authenticate, requireAuth, demandController.approve);

export default router;
