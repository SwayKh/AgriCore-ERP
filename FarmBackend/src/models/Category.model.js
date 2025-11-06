import mongoose from "mongoose";


const categorySchema = new mongoose.Schema({
    categoryType:{
        type:String,
        required:true,
        unique:true,
    }
},{timestamps:true})

export const category = mongoose.model("category", categorySchema);