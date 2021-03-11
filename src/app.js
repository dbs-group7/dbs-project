const express = require("express");
const path = require("path");
require("./db/conn");
const User = require("./models/insert"); // inserting data to mongodb, .js file
const insertFormSchema = require("./models/insert_article_form"); // inserting form data
const ejs = require("ejs");
const multer = require("multer"); // setting up multer for storing data files




const app = express();
const port = process.env.PORT || 3000; // localhost por number



//setting path to html files
const staticpath = path.join(__dirname, "../views"); //changed here from public(.html) to views(.hbs)
//console.log(path.join(__dirname,"../uploads/images"));


app.use(express.static(staticpath));
app.use(express.urlencoded({extended:false})) // to view data in .json format
app.set("view engine", "ejs");



//routing should be views folder
//app.get(path,callback)
app.get("/", (req, res)=>{ //redirecting to homepage (admin panel)
	res.render("index");
})
app.get("/homepage", (req, res)=>{ // redirecting to homepage
	insertFormSchema.find({}).sort({"_id":-1}).exec(function(err, movies){ // sort is used for decending order, fetching data from database
		res.render("homepage", {
			moviesList:movies
		})
	})
})
app.get("/about", (req, res)=>{ // redirecting to about page
	res.render("about");
})
app.get("/license", (req, res)=>{ // redirecting to license page
	res.render("license");
})
app.get("/insert_article_form", (req, res)=>{ // redirecting to insert_article_form page
	res.render("insert_article_form");
})



//For file or image storage
const storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, "./views/uploads/images");
	},
	filename: function(req, file, cb){
		cb(null, Date.now()+"_"+file.originalname);
	}
});
const upload = multer({
	storage: storage
}).single('img');



// posting data in mongodb and returning back to index.ejs
app.post("/insert_article_form", upload, async(req, res, next)=>{ //inserting data to mongodb to be displayed on homepage.ejs and returning back to index.ejs
	try{
		//const userData = new insertFormSchema(req.body);
		const userData = new insertFormSchema({
			title: req.body.title,
			year: req.body.year,
			genre: req.body.genre,
			actors: req.body.actors,
			desc: req.body.desc,
			date: req.body.date,
			img: req.file.filename,
			rating:req.body.rating,
			length:req.body.length,
			director:req.body.director
		});
		await userData.save();
		res.status(201).render("index");
	}
	catch(error){
		res.status(500).send(error);
	}
})




//server create
app.listen(port, ()=>{
	console.log('Server is running $port'); // text
})