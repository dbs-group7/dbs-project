// definingning schmema here

const mongoose = require("mongoose");
const validator = require("validator");

const userschema = mongoose.Schema({
	name: {
		type:String,
		required: true,
		minLength:3
	},
	email:{
		type:String,
		required: true,
		validate(value){
			if(!validator.isEmail(value)){
				throw new Error("Invalid email")
			}
		}
	}
})

// creating collection
const User = mongoose.model("User", userschema);

module.exports = User;
