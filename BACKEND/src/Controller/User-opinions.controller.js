import ForumOpinion from "../Models/Opinion.model.js";

const opinionForumController = {
  createOpinion: async (req, res) => {
    try {
      const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
      const opinion = typeof req.body.opinion === 'string' ? req.body.opinion.trim() : '';
      if (!title || !opinion) return res.status(400).json({ result: 'error', message: 'title and opinion are required.' });
      const newOpinion = new ForumOpinion({ ...req.body, title, opinion, author: { name: req.usuario.name, avatar: req.usuario.avatar || '', userId: req.usuario._id }, isUserPost: true });
      const savedOpinion = await newOpinion.save();

      res.status(201).json({
        result: "success",
        message: "Forum opinion created successfully",
        data: savedOpinion
      });
    } catch (error) {
      res.status(500).json({
        result: "error",
        message: "Failed to create forum opinion",
        error: error.message || error
      });
    }
  },

  getAllOpinions: async (req, res) => {
    try {
      const opinions = await ForumOpinion.find().sort({ createdAt: -1 });

      res.status(200).json({
        result: "success",
        message: "Forum opinions retrieved successfully",
        data: opinions
      });
    } catch (error) {
      res.status(500).json({
        result: "error",
        message: "Failed to retrieve forum opinions",
        error: error.message || error
      });
    }
  },

  getOpinionById: async (req, res) => {
    try {
      const opinion = await ForumOpinion.findById(req.params.id);

      if (!opinion) {
        return res.status(404).json({
          result: "error",
          message: "Forum opinion not found"
        });
      }

      res.status(200).json({
        result: "success",
        message: "Forum opinion retrieved successfully",
        data: opinion
      });
    } catch (error) {
      res.status(500).json({
        result: "error",
        message: "Failed to retrieve opinion by ID",
        error: error.message || error
      });
    }
  },

  updateOpinion: async (req, res) => {
    try {
      const existing = await ForumOpinion.findById(req.params.id);
      if (!existing) return res.status(404).json({ result: 'error', message: 'Forum opinion not found.' });
      if (existing.author?.userId?.toString() !== req.auth.id && req.auth.rol !== 'admin') return res.status(403).json({ result: 'error', message: 'Not allowed to edit this opinion.' });
      const update = {};
      if (typeof req.body.title === 'string') update.title = req.body.title.trim();
      if (typeof req.body.opinion === 'string') update.opinion = req.body.opinion.trim();
      if (typeof req.body.category === 'string') update.category = req.body.category;
      const updatedOpinion = await ForumOpinion.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });

      if (!updatedOpinion) {
        return res.status(404).json({
          result: "error",
          message: "Forum opinion not found to update"
        });
      }

      res.status(200).json({
        result: "success",
        message: "Forum opinion updated successfully",
        data: updatedOpinion
      });
    } catch (error) {
      res.status(500).json({
        result: "error",
        message: "Failed to update forum opinion",
        error: error.message || error
      });
    }
  },

  deleteOpinion: async (req, res) => {
    try {
      const deletedOpinion = await ForumOpinion.findByIdAndDelete(req.params.id);

      if (!deletedOpinion) {
        return res.status(404).json({
          result: "error",
          message: "Forum opinion not found to delete"
        });
      }

      res.status(200).json({
        result: "success",
        message: "Forum opinion deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        result: "error",
        message: "Failed to delete forum opinion",
        error: error.message || error
      });
    }
  }
};

export default opinionForumController;