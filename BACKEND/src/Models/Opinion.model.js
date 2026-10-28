import mongoose from "mongoose";

const attachedProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  price: { type: String, required: true, trim: true },
  image: { type: String, default: "" },
  officialUrl: { type: String, required: true, trim: true }
}, { _id: false });

const forumOpinionSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, "Title is required"], 
    trim: true,
    index: true 
  },
  opinion: { 
    type: String, 
    required: [true, "Opinion content is required"], 
    trim: true 
  },
  excerpt: { 
    type: String, 
    trim: true 
  },
  category: { 
    type: String, 
    required: [true, "Category is required"],
    enum: ["ecommerce", "technology", "fashion", "home", "gaming", "beauty", "supermarket", "marketplace"],
    default: "ecommerce",
    index: true
  },
  categoryLabel: { 
    type: String, 
    default: "E-commerce" 
  },
  score: { 
    type: Number, 
    min: 0, 
    max: 5, 
    default: 0 
  },
  votes: { 
    type: Number, 
    default: 0 
  },
  commentsCount: { 
    type: Number, 
    default: 0 
  },
  author: {
    name: { type: String, required: true },
    avatar: { type: String, default: "https://i.pravatar.cc/150" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }
  },
  product: { 
    type: attachedProductSchema, 
    required: false 
  },
  isUserPost: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true 
});

forumOpinionSchema.index({ title: "text", opinion: "text", category: "text" });

export default mongoose.model("ForumOpinion", forumOpinionSchema);