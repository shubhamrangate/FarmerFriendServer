var express=require('express');
var bodyParser=require('body-parser');
var mongoose=require('mongoose');

var Products=require('../models/products');
var authenticate = require('../authenticate');
 
var productRouter=express.Router();
productRouter.use(bodyParser.json());

productRouter.route('/')
.get((req,res,next)=>{
	Products.find({})
    .populate('manifacturer')
	.then((products)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(products);
	},(err)=>next(err))
	.catch((err)=>next(err))
})

.post(authenticate.verifyUser,authenticate.verifyFarmer, (req,res,next)=>{
    req.body.manifacturer=req.user._id;
	Products.create(req.body)
   .then((product)=>{
    Products.findById(product._id)
    .populate('manifacturer')
    .then((product)=>{
        console.log('Product Created',product);
         res.statusCode=200;
         res.setHeader('Content-Type','application/json');
        res.json(product);
      
    /*console.log('Product Created',product);
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json(product);*/
   },(err)=>next(err))
   //.catch((err)=>next(err));
   },(err)=>next(err))
   .catch((err)=>next(err));
})

.put(authenticate.verifyUser, (req,res,next)=>{
    res.statusCode=403;
    res.end("put operation is not suported");
})

.delete(authenticate.verifyUser,authenticate.verifyFarmer, (req,res,next)=>{
     Products.deleteMany({manifacturer:req.user._id})
     .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp); 
     },(err)=>next(err))
     .catch((err)=>next(err));
});

productRouter.route('/:productId?')
.get((req,res,next)=>{
    Products.findById(req.params.productId)
    .populate('manifacturer')
    .then((product)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(product);
    },(err)=>next(err))
    .catch((err)=>next(err));
})

.post((req,res,next)=>{
   res.statusCode=403;
   res.end("post operation is not suported for particular product");
})

.put(authenticate.verifyUser,authenticate.verifyFarmer, (req,res,next)=>{
  Products.findById(req.params.productId)
  .then((product)=>{
    if(product.manifacturer!=req.user._id){
      var err = new Error('You are not authorized to change anothers product data!');
        err.status = 403;
         next(err); 
    }
    else{
        Products.findByIdAndUpdate(req.params.productId,{$set:req.body},{new:true})  
      .then((product)=>{
       res.statusCode=200;
       res.setHeader('Content-Type','application/json');
       res.json(product);
      },(err)=>next(err))
    }
  })  
  .catch((err)=>next(err));
})

.delete(authenticate.verifyUser,authenticate.verifyFarmer, (req,res,next)=>{

    Products.findById(req.params.productId)
  .then((product)=>{
    if(product.manifacturer!=req.user._id){
      var err = new Error('You are not authorized to change anothers product data!');
        err.status = 403;
         next(err); 
    }
    else{
        Products.findByIdAndRemove(req.params.productId)
    .then((product)=>{
       res.statusCode=200;
       res.setHeader('Content-Type','application/json');
       res.json(product); 
    },(err)=>next(err))
    }
  })
    .catch((err)=>next(err));
});


module.exports=productRouter;