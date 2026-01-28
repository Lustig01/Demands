import { Router } from "express";

// Organization routes
import centerRoutes from "./organization/center.routes";
import branchRoutes from "./organization/branch.routes";
import sectionRoutes from "./organization/section.routes";

// Location routes
import baseRoutes from "./location/base.routes";
import environmentRoutes from "./location/environment.routes";
import networkRoutes from "./location/network.routes";
import locationRoutes from "./location/location.routes";

// Service routes
import serviceRoutes from "./service/service.routes";
import resourceRoutes from "./service/resource.routes";
import capacityRoutes from "./service/capacity.routes";

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
