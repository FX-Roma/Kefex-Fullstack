import ComentarioForo from '../Models/E-commentsForumModule.js';
import fs from 'fs';
import path from 'path';

const controllerComments = {
    createComment: async(req,res)=>{
        try {
            const newComment = new ComentarioForo({
                autor: {
                    nombre: req.body.nombre || "Usuario Anónimo",
                    avatar: req.body.avatar || "https://i.pravatar.cc/150",
                    usuarioId: req.body.usuarioId
                },
                texto: req.body.texto,
                likes: req.body.likes || 0,
            });

            const saveComment = await newComment.save();
            res.status(201).json({
                result: 'fine',
                message: 'Comentario creado con éxito',
                data: saveComment,
            });
        } catch (error) {
            res.status(500).json({
                result: 'mistake',
                message: 'Error al crear el comentario',
                data: error.message || error,
            });
        }
    },
    readAllComments: async (req, res) => {
        try {
            const foundComments = await ComentarioForo.find();
            res.status(200).json({
                result: 'fine',
                message: 'Comentarios leídos con éxito',
                data: foundComments,
            });
        } catch (error) {
            res.status(500).json({
                result: 'mistake',
                message: 'Error al leer los comentarios',
                data: error.message || error,
            });
        }
    },

    readCommentByID: async(req,res)=>{
        try{
            const foundCommentById = await ComentarioForo.findById(req.params.id)

            if(foundCommentById._id){
                res.json({
                    result: 'fine',
                    message:'comment found by id',
                    data: foundCommentById,
                })
            }
        }catch (error) {
            res.json({
            result: 'mistake',
            message: 'An error occurred reading the comment by Id',
            data: error,
            });
        }

    },
    updateComment: async(req,res)=>{

        try{
            const commentUpdated = await ComentarioForo.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new:true});
            res.status(200).json({
                result: 'fine',
                message: 'product updated successfully',
                data: commentUpdated,
            })
        }catch(error){
            res.status(500).json({
                result: 'mistake',
                message: "Error al actualizar producto", error: error.message || error,
            })
        }
    },
    deleteCommentByID: async(req,res)=>{
        try{
            const commentDeleted = await ComentarioForo.findByIdAndDelete(req.params.id);
            res.status(200).json({ 
                message: "product deleted successfully"
            })
        }catch(error){
            res.json({
                mensaje: "Error al eliminar producto", error: error.message || error,
            })
        }

    }


}

export default controllerComments;