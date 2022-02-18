var express=require('express');
var mongoose=require('mongoose')
var Schema=mongoose.Schema;

const orderSchema=new Schema({
	product:{
		type:mongoose.Schema.Types.ObjectId,
   	ref:'Product'
	},
	buyer:{
		type:mongoose.Schema.Types.ObjectId,
      ref:'User'
	},
	manifacturer:{
		type:mongoose.Schema.Types.ObjectId,
      ref:'User'
	},
	quantity:{
		type:Number,
		required:true
	},
	address:{
		type:String,
		required:true
	},
	completedStatus:{
		type:Boolean
	}
  },
	{
		timestamps:true
});
module.exports=mongoose.model('Order',orderSchema);