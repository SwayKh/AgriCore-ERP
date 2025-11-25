import mongoose from "mongoose";


const categorySchema = new mongoose.Schema({
    categoryName:{
        type:String,
        required:true,
        unique:true,
    },
    unit:{
        type: String,
        required: true,
    },
    ownerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    }
},{timestamps:true})

export const Category = mongoose.model("Category", categorySchema);