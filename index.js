// Import required modules
const express = require("express");
const path = require("path");

// Set the port number for the server.
const port = 8085;

// Import the database configuration file
const db = require("./config/mongoose.js");

// Import the Task model
const Task = require("./models/task.js");

// Create an Express application
const app = express();

// Set the view engine to EJS
app.set("view engine", "ejs");

// Set the path to the views directory
app.set("views", path.join(__dirname, "views"));

// Middleware to parse the incoming data in the request body
app.use(express.urlencoded({ extended: true }));

// Middleware to serve static files from the 'assets' directory
app.use(express.static('assets'));

// Route for the home page
// Route for the home page
app.get("/", (req, res) => {
    // Find all tasks in the database using the Task model
    Task.find({})
      .then((tasks) => {
        // Format the date of each task to 'Jul 20, 2023'
        const formattedTasks = tasks.map((task) => {
          // Convert the 'date' field from the task document to a Date object
          const taskDate = new Date(task.date);
  
          // Format the date using 'toLocaleDateString'
          const formattedDate = taskDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
  
          // Create a new object with the formatted date and other fields
          return {
            ...task._doc,
            date: formattedDate,
          };
        });
  
        // Render the 'home' view with the tasks and the formatted date
        return res.render("home", {
          title: "Todo App",
          task: formattedTasks,
        });
      })
      .catch((error) => {
        console.error("Error finding tasks:", error);
        return;
      });
  });


// Route to handle creating a new task
app.post("/create-task", (req, res) => {
    // Get the task details from the request body
    const newTask = {
        description: req.body.description,
        category: req.body.category,
        date: req.body.date,
    }

    // Create a new task in the database using the Task model
    Task.create(newTask).then(task => {
        // console.log('Task created successfully: ', task);
        // Redirect back to the previous page after task creation is complete
        return res.redirect("back");
    })
    .catch(error => {
        console.error('Error creating Task:', error);
        return;
    });
});


// Route to handle deleting tasks
app.post('/delete-task', async function(req, res) {
    // Get the array of ids from the body of the request
    const idsToDelete = Object.keys(req.body);
    
    // Checking if there are any ids to delete
    if (!idsToDelete || idsToDelete.length === 0) {
        return res.redirect('back');
    }

    try {
        // Find and delete tasks using the $in operator with async/await
        await Task.deleteMany({ _id: { $in: idsToDelete } });
        // console.log('Tasks deleted successfully');
        // Redirect back to the previous page after the deletion is complete
        return res.redirect('back');
    } catch (err) {
        console.log('Error in deleting tasks:', err);
        // Handle error and redirect back to the previous page
        return res.redirect('back');
    }
});

// Start the server and listen on the specified port
app.listen(port, (err) => {
    if (err) {
        console.log(`Error : ${err}`);
        return;
    }
    console.log(`Server is up and running at port: ${port}`);
});
