import { Router } from "express";

// Organization routes
import centerRoutes from "./center.routes";
import branchRoutes from "./branch.routes";
import sectionRoutes from "./section.routes";

// Location routes
import baseRoutes from "./base.routes";
import environmentRoutes from "./environment.routes";
import networkRoutes from "./network.routes";
import locationRoutes from "./location.routes";

// Service routes
import serviceRoutes from "./service.routes";
import resourceRoutes from "./resource.routes";
import capacityRoutes from "./capacity.routes";

const router = Router();

// Organization endpoints
router.use("/centers", centerRoutes);
router.use("/branches", branchRoutes);
router.use("/sections", sectionRoutes);

// Location endpoints
router.use("/bases", baseRoutes);
router.use("/environments", environmentRoutes);
router.use("/networks", networkRoutes);
router.use("/locations", locationRoutes);

// Service endpoints
router.use("/services", serviceRoutes);
router.use("/resources", resourceRoutes);
router.use("/capacities", capacityRoutes);

export default router;
