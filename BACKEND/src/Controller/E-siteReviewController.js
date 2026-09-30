import SiteReview from "../Models/E-siteReviewModule.js";

const siteReviewController = {
  createSite: async (req, res) => {
    try {
      const newSite = new SiteReview(req.body);
      const savedSite = await newSite.save();

      res.status(201).json({
        result: "success",
        message: "Site created successfully",
        data: savedSite
      });
    } catch (error) {
      res.status(500).json({
        result: "error",
        message: "Failed to create site review",
        error: error.message || error
      });
    }
  },

  getAllSites: async (req, res) => {
    try {
      const sites = await SiteReview.find().sort({ averageRating: -1 });

      res.status(200).json({
        result: "success",
        message: "Sites retrieved successfully",
        data: sites
      });
    } catch (error) {
      res.status(500).json({
        result: "error",
        message: "Failed to retrieve sites",
        error: error.message || error
      });
    }
  },

  getFeaturedSite: async (req, res) => {
    try {
      // E-commerce del día
      const featuredSite = await SiteReview.findOne({ isFeaturedSite: true });

      if (!featuredSite) {
        return res.status(404).json({
          result: "error",
          message: "No featured site found for today"
        });
      }

      res.status(200).json({
        result: "success",
        message: "Featured site retrieved successfully",
        data: featuredSite
      });
    } catch (error) {
      res.status(500).json({
        result: "error",
        message: "Failed to retrieve featured site",
        error: error.message || error
      });
    }
  },

  getSiteById: async (req, res) => {
    try {
      const site = await SiteReview.findById(req.params.id);

      if (!site) {
        return res.status(404).json({
          result: "error",
          message: "Site not found"
        });
      }

      res.status(200).json({
        result: "success",
        message: "Site retrieved successfully",
        data: site
      });
    } catch (error) {
      res.status(500).json({
        result: "error",
        message: "Failed to retrieve site",
        error: error.message || error
      });
    }
  },

  updateSite: async (req, res) => {
    try {
      const updatedSite = await SiteReview.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!updatedSite) {
        return res.status(404).json({
          result: "error",
          message: "Site not found to update"
        });
      }

      res.status(200).json({
        result: "success",
        message: "Site updated successfully",
        data: updatedSite
      });
    } catch (error) {
      res.status(500).json({
        result: "error",
        message: "Failed to update site",
        error: error.message || error
      });
    }
  },

  deleteSite: async (req, res) => {
    try {
      const deletedSite = await SiteReview.findByIdAndDelete(req.params.id);

      if (!deletedSite) {
        return res.status(404).json({
          result: "error",
          message: "Site not found to delete"
        });
      }

      res.status(200).json({
        result: "success",
        message: "Site deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        result: "error",
        message: "Failed to delete site",
        error: error.message || error
      });
    }
  }
};

export default siteReviewController;