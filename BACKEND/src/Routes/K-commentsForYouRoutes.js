import { Router } from "express";
import controllerComents from "../Controller/K-commentsForYouController.js";

const routerComments = Router();
routerComments.post('/', controllerComents.createComment);
routerComments.get('/', controllerComents.readAllComments);
routerComments.get('/:id', controllerComents.readCommentByID);
routerComments.put('/:id', controllerComents.updateComment);
routerComments.delete('/:id', controllerComents.deleteCommentByID);

export default routerComments;