const mongoose = require("mongoose");

//creating a db
mongoose.connect("mongodb://localhost:27017/cms",{
	useCreateIndex: true,
	useNewUrlParser:true,
	useUnifiedTopology:true
}).then(()=>{
	console.log("success");
}).catch((error) =>{
	console.log(error);
})