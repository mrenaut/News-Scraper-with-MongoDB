// When user clicks on the Scrape New Articles data is scraped from the webpage and loaded into MongoDB///////////////////////////////////////////////////
$("#scrape").on("click", function () {
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
	//ask the back end for json with all articles from the scrapedData collection
	//hide the opening text 
	//	$("#noArticles").hide();
	$.getJSON("/", function (data) {
		console.log(data);
	});
});

//add comment button is clicked get comments and article title and displays in modal
$(document).on("click", "#commentButton", function () {
	// Save the id from artcle picked
	var thisId = $(this).attr("data_id");
	// Empty the notes from the note section
	//	$("#previousNote").empty();
	//	$("#currentArticleTitle").empty();

	// Now make an ajax call for the Article
	$.ajax({
		method: "GET",
		url: "/articles/" + thisId

	}).done(function (data) {
		console.log(data);
		//adding the id to the save note button
		$("#saveComment").attr("data_id", data._id);
		//display comments in comment modal	
		displayComments(data.comment)

	});
})
//save users comments 
$(document).on("click", "#saveComment", function () {
	// Grab the id associated with the article from the submit button
	var thisId = $(this).attr("data_id");
	var userInput = $("#userComment").val();
	// Run a POST request to change the note, using what's entered in the inputs
	$.ajax({
			method: "POST",
			url: "/articles/" + thisId,
			data: {
				// Value taken from note textarea
				body: userInput
			}
		})
		// With that done
		.done(function (data) {
					});
	//empties out the comment box
	$("#userComment").val("");
})

/////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
//tina's solution to display comments 
//function to display notes in the modal
function displayComments(data) {
	console.log(data);
	//loop to dispaly the notes in the model  
	for (var i = 0; i < data.length; i++) {
		console.log(data[i].body);
		var $commentDiv = $('<div>');
		var $noteBlock = $('<div class="card-block">');
		var $noteText = $('<blockquote class="card-blockquote">');
		var $previousComment = $('<p class="noteData">');

		//comment div
		$commentDiv.attr("id", "comment");
		$commentDiv.attr("data-id", data[i]._id);

		//notes in database
		$previousComment.text(data[i].body);
		$noteText.append($previousComment);
		$noteBlock.append($noteText);
		$commentDiv.append($noteBlock);

		$("#comments").prepend($commentDiv);

	}
}


//	//delete notes 
//	$(document).on("click", "#notes", function () {
//		var thisId = $(this).attr("data-id");
//		//making sure thier is an id and click is working 
//		console.log(thisId);
//		$.ajax({
//			method: "POST",
//			url: "/delete/" + thisId
//
//		}).done(function (data) {
//			//this
//			console.log("comment deleted");
//		})
//	})
