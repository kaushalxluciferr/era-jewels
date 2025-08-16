import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,required:true
    },
    price:{
        type:Number,
        required:true
    },
    image:{
        type:Array,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    bestseller:{
        type:Boolean
    },
    Date:{
        type:Date,
        default:Date.now()
    }

})


const productModel= mongoose.models.product || mongoose.model("Product",productSchema)

export default productModel