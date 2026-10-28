import mongoose from "mongoose";

const siteReviewSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Site name is required"], 
    unique: true, 
    trim: true 
  },
  officialUrl: { 
    type: String, 
    required: [true, "Official URL is required"], 
    trim: true 
  },
  logo: { 
    type: String, 
    default: "" 
  },
  description: { 
    type: String, 
    trim: true 
  },
  averageRating: { 
    type: Number, 
    min: 0, 
    max: 5, 
    default: 0 
  },
  totalOpinions: { 
    type: Number, 
    default: 0 
  },
  category: { 
    type: String, 
    enum: ["ecommerce", "marketplace", "official_store"],
    default: "ecommerce"
  },
  isFeaturedSite: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true 
});

export default mongoose.model("SiteReview", siteReviewSchema);