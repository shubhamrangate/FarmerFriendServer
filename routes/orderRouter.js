var express=require('express');
var bodyParser=require('body-parser');
var mongoose=require('mongoose');

var Orders=require('../models/orders');
var Products=require('../models/products'); 
var authenticate = require('../authenticate');

var orderRouter=express.Router();
var quantity;
var quantity1;
var str;
orderRouter.use(bodyParser.json());

orderRouter.route('/')
.get(authenticate.verifyUser,(req,res,next)=>{
    if(!req.user.farmer){
        //console.log('not farmer');
        Orders.find({buyer:req.user._id})
        .populate('product')
        .populate('manifacturer')
        .then((orders)=>{
          res.statusCode=200;
          res.setHeader('Content-Type','application/json');
          res.json(orders);
          },(err)=>next(err))
        .catch((err)=>next(err))
    }
    else{
        //console.log("i am farmer");
        Orders.find({manifacturer:req.user._id})
       .populate('product')
       .populate('buyer')
       .then((orders)=>{
          res.statusCode=200;
          res.setHeader('Content-Type','application/json');
          res.json(orders);
       },(err)=>next(err))
       .catch((err)=>next(err))
    }
	
})

.delete(authenticate.verifyUser,(req,res,next)=>{
     Orders.deleteMany({})
     .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp); 
     },(err)=>next(err))
     .catch((err)=>next(err));
});

orderRouter.route('/:productname/:productId')
.get(authenticate.verifyUser,(req,res,next)=>{
    Orders.find({product:req.params.productId})
    .then((orders)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(orders);
    },(err)=>next(err))
    .catch((err)=>next(err));
})

.post(authenticate.verifyUser,(req,res,next)=>{
   req.body.product=req.params.productId; 
   req.body.buyer=req.user._id;
   //req.body.manifacturer="61f40bb4c803fc0084a9e714";
   Products.findById(req.params.productId)
   .then((product)=>{
      req.body.manifacturer=product.manifacturer;
   //},(err)=>next(err))
   Orders.create(req.body)
   .then((order)=>{
    Orders.findById(order._id)
    .populate('manifacturer')
    .then((order)=>{
       res.statusCode=200;
      res.setHeader('Content-Type','application/json');
       res.json(order);
    },(err)=>next(err))

    //console.log('Order Placed',order);
    /*res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json(order);*/

   	 quantity1=req.body.quantity;
     //console.log("quantit1 is",quantity1);
   	Products.findById(req.params.productId)
     .then((product)=>{
       quantity= product.quantity;
       //console.log("originalone product quantity ",quantity);
       Products.findByIdAndUpdate(req.params.productId,{$set:{quantity:quantity-quantity1}},{new:true})  
     .then((product)=>{
       console.log('products quantity updated');
      },(err)=>next(err))
    .catch((err)=>next(err));
    
    },(err)=>next(err))
   .catch((err)=>next(err));
   
   },(err)=>next(err))

   },(err)=>next(err))
   .catch((err)=>next(err));
})

.put(authenticate.verifyUser,(req,res,next)=>{
   res.statusCode=403;
   res.end("put operation is not suported");
})

.delete(authenticate.verifyUser,(req,res,next)=>{
   res.statusCode=403;
   res.end("put operation is not suported");
});

orderRouter.route('/:orderId?')
.get(authenticate.verifyUser,(req,res,next)=>{
    Orders.findById(req.params.orderId)
    .then((order)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(order);
    },(err)=>next(err))
    .catch((err)=>next(err));
})

.post(authenticate.verifyUser,(req,res,next)=>{
   res.statusCode=403;
   res.end("post operation is not suported for particular product");
})

.put(authenticate.verifyUser,(req,res,next)=>{
  Orders.findByIdAndUpdate(req.params.orderId,{$set:req.body},{new:true})  
  .then((order)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json(order);
  },(err)=>next(err))
  .catch((err)=>next(err));
})

.delete(authenticate.verifyUser,(req,res,next)=>{
   Orders.findByIdAndRemove(req.params.orderId)
    .then((order)=>{
       res.statusCode=200;
       res.setHeader('Content-Type','application/json');
       res.json(order); 
    },(err)=>next(err))
    .catch((err)=>next(err));
});

module.exports=orderRouter;