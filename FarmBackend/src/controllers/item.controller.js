import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Item } from "../models/Item.model.js";
import { Stock } from "../models/Stock.model.js";
import { Category } from "../models/Category.model.js";


const addCategory = asyncHandler(async(req, res)=>{

    const{categoryName, unit} = req.body;

    if(!categoryName || !unit){
        throw new ApiError(404, "All fields are required! ", false);
    }

    const newCategory = await Category.create({
        categoryName,
        unit,
        ownerId:req.user?._id
    })

    if(!newCategory){
        throw new ApiError(404, "New Category creation got failed, plese try again! ", false);
    }

    return res.status(200)
    .json(new ApiResponse("Category created!! ", 200, {newCategory}));
})

const addItem = asyncHandler(async(req, res)=>{
    console.log("here");
    
    const{itemName, quantity, price, categoryName} = req.body;

    if(!itemName || !quantity ||!price || !categoryName){
        throw new ApiError(400, "All fields are necessary! ", false);
    }

    const user = req.user?._id;
    //get the category from the table 
    const retCategory = await Category.findOne({
        $or:[{user}, {categoryName}]
    })

    //if no such category exists 
    if(!retCategory){
        throw new ApiError(404, "No such category exists", false)
    }

    const item = await Item.create({
        itemName:itemName,
        price, 
        category:retCategory?._id,
    })

    if(!item){
        throw new ApiError(500, "Something wrong with Database", false);
    }

    const itemStock = await Stock.create({
        item:item?._id,
        owner:req.user?._id,
        quantity:quantity
    })

     if(!itemStock){
        throw new ApiError(500, "Something wrong with Database", false);
    }
    console.log("here");
    


    return res.status(200)
    .json(new ApiResponse("Successfull add item", 200, {
        item, 
        itemStock
    }))


})


const getItems = asyncHandler(async(req, res)=>{
    const items = await Item.find();

    if(!items){
        throw new ApiError(404, "Bad request");
    }

    return res.status(200)
    .json(new ApiResponse("Successfull data retreival", 200, {items}))
})

//update item
const updateItem = asyncHandler(async(req, res)=>{
    const { id } = req.params;
    const user = req.user._id;

    const allowedFields = ["itemName", "price"];
    const updateDataItem = {};

    for(const field of allowedFields){
        if(req.body[field] != undefined){
            updateDataItem[field] = req.body[field]
        }
    }

    const updateStock = req.body.quantity != undefined;

    let updatedItem = NULL;
    if(Object.keys(updateDataItem).length > 0){
        updatedItem = await Item.findByIdAndUpdate({_id:id},
            {$set : updateDataItem},
            {new: true}
        )
    }
    else{
        updatedItem = await Item.findOne({_id:id})
    }

    if (!updatedItem) {
        throw new ApiError(404, "Item record not found! ", false);
    }

    let updatedStock = NULL;
    if(updateStock){
        updatedStock = await Stock.findByIdAndUpdate({item:id, owner:user},
            {$set : {quantity: updateStock}},
            {new: true}
        )
    }
    else{
        updatedStock = await Stock.findOne({item:id, owner:user});
    }

    if(!updatedStock){
        throw new ApiError(404, "Stock record not found! ", false);
    }

    return res.status(200)
    .json(new ApiResponse("Item update successfully! ", 200, {updatedItem, updatedStock}));
})

//delete item
const deleteItem = asyncHandler(async(req, res)=>{
    const itemId = req.params?.id;
    const userId = req.user?._id;

    const itemFound = await Stock.findOne({item:itemId, ownder:userId});

    if(!itemFound){
        return res.status(404)
        .json(new ApiResponse("Stock not found of the required Item! ", 404));
    }

    await Item.findByIdAndDelete({_id:id});

    await Stock.findByIdAndDelete({item:itemId, ownder:userId});

    return res(200)
    .json(new ApiResponse("Item and Stock deleted Successfully! ", 200))
})




export{addItem, getItems, addCategory, updateItem, deleteItem};