import { Router } from "express";
import opinionForumController from "../Controller/E-opinionForumController.js";

const routerOpinions = Router();

routerOpinions.post("/", opinionForumController.createOpinion);
routerOpinions.get("/", opinionForumController.getAllOpinions);
routerOpinions.get("/:id", opinionForumController.getOpinionById);
routerOpinions.put("/:id", opinionForumController.updateOpinion);
routerOpinions.delete("/:id", opinionForumController.deleteOpinion);

export default routerOpinions;