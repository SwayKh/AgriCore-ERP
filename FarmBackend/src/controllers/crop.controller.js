import mongoose from "mongoose";
import { Crop } from "../models/Crop.model.js";
import { Stock } from "../models/Stock.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler.js";


const addCrop = asyncHandler(async(req, res)=>{
    //fetch the user data and validate
    //check for enough quantity of an item in stock table
    //then create a session
    //create crop entry
    //update the stock entry
 
    const{cropName, plantingDate, harvestingDate, usedItems} = req.body;

    if ([cropName, plantingDate, harvestingDate, usedItems].some((field) => field?.trim === "")) {
        //custom error
        throw new ApiError(400, "All fields are required", false);
    }

    const user = req.user?._id;

    //fetch stock for the items used
    for(const item of usedItems){
        const fetchedStock = await Stock.findById( item._id)

        if (!fetchedStock) {
            throw new ApiError(404, "No stock for the given item! ", false);
        }
        if(fetchedStock.quantity < item.quantity){
            throw new ApiError(400,"Not enough quanitity for the given item", false)
        }
    }

    const session = mongoose.startSession();
    (await session).startTransaction();

    try {
        const cropEntry = await Crop.create([{
            cropName,
            plantingDate, 
            harvestingDate,
            owner:req.user?._id,
            itemUsed:{
                usedItem: usedItems._id,
                quantity:usedItems.quantity  
            }
        }],
        {session} 
        )

        for (let u of usedItems) {
            await Stock.updateOne(
            { item: u._id, owner:req.user?._id },
            { $inc: { quantity: -u.quantityUsed } },
            { session }
        );
    }

    (await session).commitTransaction;
    await session.endSession();

    res.status(200)
    .json(new ApiResponse("Crop creating successfull! ",200, cropEntry))

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new ApiError(400, error.message);
    }

})
