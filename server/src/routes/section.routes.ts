import { Router } from "express";
import { sectionController } from "../controllers/section.controller";

const router = Router();

router.get("/", sectionController.getAll);
router.get("/branch/:centerName/:branchName", sectionController.getByBranch);
router.get("/:centerName/:branchName/:name", sectionController.getByKey);
router.post("/", sectionController.create);
router.put("/:centerName/:branchName/:name", sectionController.update);
router.delete("/:centerName/:branchName/:name", sectionController.delete);

export default router;
