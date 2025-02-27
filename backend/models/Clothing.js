const mongoose = require("mongoose");

const clothingSchema = new mongoose.Schema(
    {
            name: { type: String, required: true },
            categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
            subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
            sizes: { type: [String], default: [] },
            colors: { type: [String], default: [] },
            imageUrl: { type: String },
            images: { type: [String], default: [] },
            description: { type: String, default: "" },
            isTrending: { type: Boolean, default: false },
            authors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Author" }],
    },
    { timestamps: true }
);

const Clothing = mongoose.models.Clothing || mongoose.model("Clothing", clothingSchema);

module.exports = Clothing;
