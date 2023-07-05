// Importing the Mongoose library
const mongoose = require('mongoose');

// Creating a Schema for Tasks
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

// Creating a model based on the taskSchema
const Task = mongoose.model('Task', taskSchema);

// Exporting the Task model so it can be used in other files
module.exports = Task;
