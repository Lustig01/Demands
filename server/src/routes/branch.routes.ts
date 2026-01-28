import { Router } from "express";
import { branchController } from "../controllers/branch.controller";

const router = Router();

router.get("/", branchController.getAll);
router.get("/center/:centerName", branchController.getByCenter);
router.get("/:centerName/:name", branchController.getByKey);
router.post("/", branchController.create);
router.put("/:centerName/:name", branchController.update);
router.delete("/:centerName/:name", branchController.delete);

export default router;
