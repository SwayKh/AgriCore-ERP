import mongoose from "mongoose";


const stockSchema = new mongoose.Schema({
    location:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"location"
    },
    item:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"item"
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    quantity:{
        type:Nubmer,
        required:true,
        default:0,
    },

},{timestamps:true})

export const Stock = mongoose.model("stock", stockSchema);