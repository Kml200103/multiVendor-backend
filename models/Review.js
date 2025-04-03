const mongoose=require('mongoose')

const reviewSchema = new mongoose.Schema({
    rating: { type: Number, required: true},
    comment: { type: String, required: true, },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
     productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
