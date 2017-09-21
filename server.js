// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongojs = require("mongojs");
var mongoose = require("mongoose");
var Promise= require("bluebird");


// News website scraping tools
var request = require("request");
var cheerio = require("cheerio");

// Set mongoose to leverage built in JavaScript ES6 Promises due to deprecation

// Pulls in Article and Comment Models
var Article = require("./models/article.js");
var Comment = require("./models/comment.js");


// Initialize Express
var app = express();

//Assigns port
var port = process.env.PORT || 3000;

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
	extended: false
}));


//Sets up app to serve static files from Public folder
app.use(express.static("public"));

//Parses information from page
app.use(bodyParser.urlencoded({extended: false}));

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
///////////////////////////////////////////////////////////////////needs updated part for heroku
//mongoose localhost connection
//mongoose.connect("mongodb://localhost/newscraper");
////mongoose heroku 
mongoose.connect("mongodb://heroku_p34rg5qt:2f7rjqmikanrv535tog9eqcjim@ds141524.mlab.com:41524/heroku_p34rg5qt");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
	console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
	console.log("Mongoose connection successful.");
});


// Routes
//// ======
//

	
// Hook mongojs configuration to the database
Article.on("error", function (error) {
	console.log("Database Error:", error);
});


// Main route to render webpage
app.get("/", function (req, res) {
	Article.find({})
		.then(function (articles) {
		res.render("index", {
			articles: articles
		});
	})
});

//Route to retrieve Articles from the database
app.get("/articles", function (req, res) {
	Article.find({}, function (error, found) {
		// Throw any errors to the console
		if (error) {
			console.log(error);
		}
		// If there are no errors, send the result of this query to the browser as json
		else {
			res.json(found);
			res.redirect('/');
		}
	});
});

// Route to scrape data from the html and input into MongoDB
app.get("/scrape", function (req, res) {

	// Make a request for the news section of combinator
	request("http://www.newyorktimes.com", function (error, response, html) {
		// Load the html body from request into cheerio
		var $ = cheerio.load(html);
		// Finds each element with a theme-summary class
		$(".theme-summary").each(function(i, element) {
			//all scraped articles will be save into this empty array.    
			var results = {};
			// In each .theme-summary, we grab the child with the class story-heading
			// Then we grab the inner text of the this element and store it
			//Gets Title from HTML			
			results.title = $(this).children(".story-heading").text().trim();
			//Gets Summary from HTML
			results.summary = $(this).children(".summary").text().trim();
			//Gets Link from HTML
			results.link = $(element).children("a").attr("href");


			//Makes new article out of scraped data using Article Model
			var scrapedData = new Article(results);

			//Saves new articles into MongoDB
			scrapedData.save(function (err, doc) {
				// log any errors
				if (err) {
					console.log(err);
				}
				// or log the doc
				else {
					console.log(doc);    
				}
			});
		});
	});
});


//getting note for specific article
app.get("/articles/:id", function (req, res) {
	Article.findOne({
		"_id": req.params.id
	})
		.populate("comment")
	// Now, execute that query
		.exec(function (error, doc) {
		// Send any errors to the browser
		if (error) {
			res.send(error);
		}
		// Or, send our results to the browser, which will now include the books stored in the library
		else {
			res.send(doc);
		}
	});
});

//

// Create a new note 
app.post("/articles/:id", function (req, res) {
	// Create a new note and pass the req.body to the entry
	var newComment = new Comment(req.body);

	// And save the new note the db
	newComment.save(function (error, doc) {
		// Log any errors
		if (error) {
			console.log(error);
		}
		// Otherwise
		else {
			// Use the article id to find and update it's note
			//need "{new: true}" in our call,
			// or else our query will return the object as it was before it was updated
			Article.findOneAndUpdate({
				_id: req.params.id
			}, {
				$push: {
					comment: doc._id
				}
			}, {
				new: true
			})
			// Execute the above query
				.exec(function (err, doc) {
				// Log any errors
				if (err) {
					console.log(err);
				} else {
					// Or send the document to the browser
					res.send(doc);
				}
			});
		}
	});
});

//delete note by id
app.post("/delete/:id", function (req, res) {
	Comment.findByIdAndRemove({
		_id: req.params.id
	},
					   function (error) {
		// Throw any errors to the console
		if (error) {
			console.log(error);
		}

	});

});



//ROUTE TO SAVE ARTICLE NOT FUNCTIONAL//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//ROUTE TO  CLEAR ANY ARTICLES NOT INTENDED TO BE SAVED FUNCTIONAL//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//app.post("/saveArticle", function (req, res) {

//});	






// Listen on port 3000
app.listen(port, function() {
	console.log("App running on port 3000!");
});

