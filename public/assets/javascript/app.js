


// When user clicks on the Scrape New Articles data is scraped from the webpage and loaded into MongoDB///////////////////////////////////////////////////
$("#scrapeButton").on("click", function () {   
    // Do an api call to the back end for json
    $.getJSON("/scrape", function () {
        console.log("Scrape Successful!");
    });
});


//Retrieves all articles in MongoDB///////////////////////////////////////////////////
$.getJSON("/articles", function (data) {
	// If there is data, console log it for debugging
	if (data != 0) {
		//        $("#noArticles").show();
		console.log(data);
	}
});


//Displays the articles in MongoDB after page reload/////////////////////////////////////
$("#reloadToDisplay").on("click", function () {    
	//Hides the No Articles in Database message    
	$.getJSON("/", function (data) {
		console.log(data); 
		$("#noArticles").hide();
	});
});


//add comment button is clicked get notes and display this article title.
$(document).on("click", ".commentButton" ,function () {
	// Save the id from artcle picked
	var thisId = $(this).attr("data_id");
	// Empty the notes from the note section
//	$("#previousNote").empty();


	// Now make an ajax call for the Artsicle
	$.ajax({
		method: "GET",
		url: "/articles/" + thisId

	}).done(function (data) {
		console.log(data);
		
		$("#saveComment").attr("data_id", data._id);

	});
})

// When you click the savenote button
$(document).on("click", "#saveComment", function() {
	// Grab the id associated with the article from the submit button
	var thisId = $(this).attr("data-id");

	// Run a POST request to change the note, using what's entered in the inputs
	$.ajax({
		method: "POST",
		url: "/articles/" + thisId,
		data: {
			
			// Value taken from note textarea
			body: $("#userComment").val()
		}
	})
	// With that done
		.done(function(data) {
		// Log the response
		console.log(data);
		// Empty the notes section
		$("#notes").empty();
	});

	// Also, remove the values entered in the input and textarea for note entry
//	$("#titleinput").val("");
	$("#userComment").val("");
});


// Whenever someone clicks a comments button
$(document).on("click", ".commentButton", function() {
	// Empty the notes from the note section
	$("#commentbox").empty();
	// Save the id from the p tag
	var thisId = $(this).attr("data-id");

	// Now make an ajax call for the Article
	$.ajax({
		method: "GET",
		url: "/articles/" + thisId,
		body: body
	})
	// With that done, add the note information to the page
		.done(function(data) {
		console.log(data);
		// The title of the article
		$("#commentbox").prepend("<h2>" + data.body + "</h2>");
		// An input to enter a new title
//		$("#notes").append("<input id='titleinput' name='title' >");
//		// A textarea to add a new note body
//		$("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
//		// A button to submit a new note, with the id of the article saved to it
//		$("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

		// If there's a note in the article
//		if (data.note) {
//			// Place the title of the note in the title input
//			$("#titleinput").val(data.note.title);
//			// Place the body of the note in the body textarea
//			$("#bodyinput").val(data.note.body);
//		}
	});
});


////delete notes 
//$(document).on("click", "#notes", function () {
//	var thisId = $(this).attr("data-id");
//	//making sure thier is an id and click is working 
//	console.log(thisId);
//	$.ajax({
//		method: "POST",
//		url: "/delete/" + thisId
//
//	}).done(function (data) {
//		//this
//		console.log("note deleted");
//	})
//})






