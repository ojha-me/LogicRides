// import the express library
const express =  require("express");

// create an app ( the express application instance)
const app = express();


// define a port for the server to listen on
// process.env.PORT is used in deployed app and we'll use 3000 locally
const PORT = process.env.PORT || 3000;

// define a simple route for homepage 
app.get("/",(req, res) => {
    res.send('Hello World! Welcome to the LogicRides Backend!');
});


// start the server and make it listen on the defined port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});