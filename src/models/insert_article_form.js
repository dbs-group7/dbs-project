// definingning schmema here

const mongoose = require("mongoose");


const insertFormSchema = mongoose.Schema({
	title: {
		type:String
	},
	year: {
		type:Number
	},
	genre: {
		type:String
		
	},
	actors: {
		type:String
	},
	desc: {
		type:String
	},
	date:{
		type:Date,
		default:Date.now
	},
	img:{
		type:String
	},
	rating:{
		type:String
	},
	length:{
		type:String
	},
	director:{
		type:String
	}
	
})

// creating collection
const User = mongoose.model("Movies", insertFormSchema); // user is the collection name
module.exports = User;
