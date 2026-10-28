import ForumOpinion from "../Models/Opinion.model.js";
import SiteReview from "../Models/Site.model.js";
import Producto from "../Models/Product.model.js";
import SearchHistory from "../Models/SearchHistory.model.js";

const searchForumController = {
  /**
   * Global Search Endpoint & Search Analytics
   * GET /api/search?q=shopify
   */
  globalSearch: async (req, res) => {
    try {
      const { q } = req.query;

      if (!q || q.trim() === "") {
        return res.status(200).json({
          result: "success",
          query: "",
          totalResults: 0,
          data: { opinions: [], sites: [], products: [] }
        });
      }

      const cleanQuery = q.trim();
      const escapedQuery = cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(escapedQuery, "i");

      // Save or update search query count asynchronously (without blocking response)
      SearchHistory.findOneAndUpdate(
        { query: cleanQuery.toLowerCase() },
        { $inc: { searchCount: 1 }, $set: { lastSearchedAt: new Date() } },
        { upsert: true, new: true }
      ).exec().catch(() => {});

      // Execute search across entities in parallel
      const [opinions, sites, products] = await Promise.all([
        ForumOpinion.find({
          $or: [
            { title: searchRegex },
            { opinion: searchRegex },
            { category: searchRegex },
            { "product.name": searchRegex }
          ]
        }).limit(10),

        SiteReview.find({
          $or: [
            { name: searchRegex },
            { description: searchRegex },
            { category: searchRegex }
          ]
        }).limit(5),

        Producto.find({
          $or: [
            { nombre: searchRegex },
            { descripcion: searchRegex },
            { categoria: searchRegex }
          ]
        }).limit(5)
      ]);

      const totalResults = opinions.length + sites.length + products.length;

      res.status(200).json({
        result: "success",
        query: cleanQuery,
        totalResults,
        data: { opinions, sites, products }
      });
    } catch (error) {
      res.status(500).json({
        result: "error",
        message: "An error occurred while executing the global search",
        error: error.message || error
      });
    }
  },

  /**
   * Retrieve Top Trending Searches
   * GET /api/search/trending
   */
  getTrendingSearches: async (req, res) => {
    try {
      const trending = await SearchHistory.find()
        .sort({ searchCount: -1 })
        .limit(5);

      res.status(200).json({
        result: "success",
        data: trending
      });
    } catch (error) {
      res.status(500).json({
        result: "error",
        message: "Failed to retrieve trending searches",
        error: error.message || error
      });
    }
  },

  /**
   * Filter Opinions by Category
   * GET /api/search/category/:categoryName
   */
  getOpinionsByCategory: async (req, res) => {
    try {
      const { categoryName } = req.params;

      const opinions = await ForumOpinion.find({
        category: categoryName.toLowerCase()
      }).sort({ createdAt: -1 });

      res.status(200).json({
        result: "success",
        category: categoryName,
        totalResults: opinions.length,
        data: opinions
      });
    } catch (error) {
      res.status(500).json({
        result: "error",
        message: "Failed to retrieve opinions by category",
        error: error.message || error
      });
    }
  }
};

export default searchForumController;