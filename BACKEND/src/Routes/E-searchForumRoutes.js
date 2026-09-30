import { Router } from "express";
import searchForumController from "../Controller/E-searchForumController.js";

const routerSearch = Router();

routerSearch.get("/", searchForumController.globalSearch);
routerSearch.get("/trending", searchForumController.getTrendingSearches); // Endpoint para widget de Tendencias
routerSearch.get("/category/:categoryName", searchForumController.getOpinionsByCategory);

export default routerSearch;