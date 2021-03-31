
const express = require("express");
const path = require("path");
require("./db/conn");
const User = require("./models/insert"); // inserting data to mongodb, .js file
const insertFormSchema = require("./models/insert_article_form"); // inserting form data

const reviewFormSchema = require("./models/userReview"); // Review form data

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

//Data fetching
app.get("/homepage", (req, res)=>{ // redirecting to homepage
	insertFormSchema.find({}).sort({"_id":-1}).exec(function(err, movies){ // sort is used for decending order, fetching data from database
		res.render("homepage", {
			moviesList:movies
		})
	})
})
app.get("/reviewHome", (req, res)=>{ // redirecting to homepage
	reviewFormSchema.find({}).sort({"_id":-1}).exec(function(err, review){ // sort is used for decending order, fetching data from database
		res.render("reviewHome", {
			reviewList:review
		})
	})
})


//JOINS
/*
app.get("/join", (req, res)=>{
	UserCollection.aggregate([
	{
		$lookup:{
			from:"reviews",
			as:"reviews",
			let:{title_id:"$title"},
			pipeline:[
			{$match:{$expr:{$eq:[]}}}
			]
		}
	}
	])
})
*/



//Auto Complete Function

app.get('/autocomplete', function(req, res, next){
	var regex = new RegExp(req,query["term"], 'i');
	insertFormSchema.find({title:regex}, {"title":1}).limit(10).exec(function(err, data){
		
	var result = [];
	if(!err){
		if(data && data.length && data.length>0)
		{
			data.forEach(user=>{
				let obj={
					id:movies._id,
					label:movies.title
				};
				result.push(obj);
			});
		}
		
		res.jsonp(result);
	}
		
	});
});



//Data deleting
app.get('/delete/:id', function(req, res){
var id = req.params.id;
var del = insertFormSchema.findByIdAndDelete(id);

	del.exec(function(err, movies){
		res.render("index", {success:"Document deleted successfully"})
	})
})
//Edit data
app.get('/edit/:id', async function(req, res){
var id = req.params.id;
var edit = insertFormSchema.findById(id);

	edit.exec(function(err, result){
		res.render("edit", {
			id:id,
			title:result.title,
			rating:result.rating,
			year:result.year,
			length:result.length,
			genre:result.genre,
			actors:result.actors,
			director:result.director,
			desc:result.desc
		})
	})
})

//Update
app.post('/update/', async function(req, res){
var update = insertFormSchema.findByIdAndUpdate(req.body.id,{
			title: req.body.title,
			year: req.body.year,
			genre: req.body.genre,
			actors: req.body.actors,
			desc: req.body.desc,
			date: req.body.date,
			img: req.file.filename,
			rating:req.body.rating,
			length:req.body.length,
			director:req.body.director,
			comments:req.body.comments,
			value_check:1
	
});

	update.exec(function(err, result){
		res.render("homepage")
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
app.get("/search", (req, res)=>{ // redirecting to insert_article_form page
	res.render("search");
})
app.get("/insert_review_form", (req, res)=>{ // redirecting to insert_article_form page
	res.render("insert_review_form");
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




app.post("/userReview", upload, async(req, res, next)=>{ //inserting data to mongodb to be displayed on homepage.ejs and returning back to index.ejs
	try{
			const review = new reviewFormSchema({
			title: req.body.title,
			comments: req.body.comments,
			date: req.body.date,
			name: req.body.name,
			value_check:1,
			
		});
		await review.save();	
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