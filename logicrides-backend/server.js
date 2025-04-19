// load variables from .env to process.env
require("dotenv").config();

// import the express library
const express =  require("express");
const mongoose = require("mongoose");

const apiRoutes = require("./routes/api/index");
const usersRoutes = require("./routes/api/users");
const carRoutes = require("./routes/api/cars");

// create an app ( the express application instance)
const app = express();


// define a port for the server to listen on
// process.env.PORT is used in deployed app and we'll use 3000 locally
const PORT = process.env.PORT || 3000;

// load the db uri
const dbURI = process.env.MONGODB_URI;

if (!dbURI) {
    console.error("Database URI is missing in the env. Please provide a valid URI");
    process.exit(1); // Exit the application if DB connection string is missing
}

// function to connect to the database
const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Database connection successful");
    }
    catch (error) {
        console.error("Database connection failed", error);
        process.exit(1);
    }
}

connectDB();

// middleware
app.use(express.json()); // parses the requests with json payload

// mount the api routes
// app.use("path", router)
// any requests starting with /api will be handled by apiRoutes
// For any request whose path starts with /api, pass the request handling over to the apiRoutes router.
app.use("/api", apiRoutes);
app.use("/api/users", usersRoutes);
app.use('/api/cars', carRoutes);


app.get('/', (req, res) => {
    res.send('Hello World! LogicRides Backend is Running!'); // Updated message
});


// start the server and make it listen on the defined port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
