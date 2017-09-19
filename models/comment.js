
// Require mongoose
var mongoose = require("mongoose");


// Creates a schema class
var Schema = mongoose.Schema;

// Creates the comment schema
var CommentSchema = new Schema({
	// Just a string
	
	// Just a string
	body: {
		type: String
	}
	
});



// Create the Note model with the NoteSchema
var Comment = mongoose.model("Comment", CommentSchema);

// Export the Note model
module.exports = Comment;




