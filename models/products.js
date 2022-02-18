var mongoose=require('mongoose');
var Schema=mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const productSchema=new Schema({
   name:{
   	type:String,
   	required:true,
   },
   description:{
   	type:String,
   	required:true
   },
   image:{
   	type:String,
   	required:true
   },
   category:{
   	type:String,
   },
   quantity:{
   	type:Number,
   	required:true
   },
   price:{
   	type:Currency,
    required:true,
    min:0
   },
   manifacturer:{
   	type:mongoose.Schema.Types.ObjectId,
      ref:'User'
   }
  },
   {
		timestamps:true
});

module.exports=mongoose.model('Product',productSchema);