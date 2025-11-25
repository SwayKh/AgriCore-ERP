import mongoose from "mongoose";

const cropSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    category:{
        type:String,
        required:true,
    },
    plantingDate:{
        type:Date,
        required:true,
    },
    harvestingDate:{
        type:Date,
        required:true,
    },
    expectedYield:{
        type:Date,
        required:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    }
},{timestamps:true});

export const Crop = mongoose.model("Crop", cropSchema);