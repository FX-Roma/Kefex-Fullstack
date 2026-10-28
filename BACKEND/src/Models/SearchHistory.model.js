import mongoose from "mongoose";

const searchHistorySchema = new mongoose.Schema({
  query: { 
    type: String, 
    required: [true, "Search query text is required"], 
    trim: true,
    lowercase: true,
    index: true 
  },
  searchCount: { 
    type: Number, 
    default: 1 
  },
  lastSearchedAt: { 
    type: Date, 
    default: Date.now 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Usuario",
    required: false 
  }
}, { 
  timestamps: true 
});

searchHistorySchema.index({ searchCount: -1 });

export default mongoose.model("SearchHistory", searchHistorySchema);