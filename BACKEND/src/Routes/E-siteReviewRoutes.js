import { Router } from "express";
import siteReviewController from "../Controller/E-siteReviewController.js";

const routerSites = Router();

routerSites.post("/", siteReviewController.createSite);
routerSites.get("/", siteReviewController.getAllSites);
routerSites.get("/featured", siteReviewController.getFeaturedSite); // Endpoint para "E-commerce del día"
routerSites.get("/:id", siteReviewController.getSiteById);
routerSites.put("/:id", siteReviewController.updateSite);
routerSites.delete("/:id", siteReviewController.deleteSite);

export default routerSites;