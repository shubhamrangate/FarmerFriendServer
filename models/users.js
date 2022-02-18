var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var passportLocalMongoose=require('passport-local-mongoose');

const User=new Schema({
	
	/*username:{
		type:String,
		required:true,
		unique:true
	},
	password:{
		type:String,
		required:true
	},*/

	farmer:{
		type:Boolean,
		default:false
	}
});

User.plugin(passportLocalMongoose);
module.exports=mongoose.model('User',User);