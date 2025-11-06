import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true,
    },
    unit:{
        type:String,
        requrired:true,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"category",
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    }
},{timestamps:true})

export const User = mongoose.model("item", itemSchema );