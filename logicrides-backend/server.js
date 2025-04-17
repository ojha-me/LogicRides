// import the express library
const express =  require("express");
const apiRoutes = require("./routes/api");

// create an app ( the express application instance)
const app = express();


// define a port for the server to listen on
// process.env.PORT is used in deployed app and we'll use 3000 locally
const PORT = process.env.PORT || 3000;

// mount the api routes
// app.use("path", router)
// any requests starting with /api will be handled by apiRoutes
// For any request whose path starts with /api, pass the request handling over to the apiRoutes router.
app.use("/api", apiRoutes);

app.get('/', (req, res) => {
    res.send('Hello World! LogicRides Backend is Running!'); // Updated message
  });


// start the server and make it listen on the defined port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

