import ForumOpinion from "../Models/E-opinionForumModule.js";

const opinionForumController = {
  createOpinion: async (req, res) => {
    try {
      const newOpinion = new ForumOpinion(req.body);
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
      const updatedOpinion = await ForumOpinion.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

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