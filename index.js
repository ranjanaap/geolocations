'use strict';


// Dependencies
var express = require('express'),
    parser = require('body-parser'),
    routes = require('./routes'),
    path = require('path'),
    swaggerJSDoc = require('swagger-jsdoc');

// Initialize express
var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(parser.json()); // support json-encoded bodies
app.use(parser.urlencoded({ // support url-encoded bodies
    extended: true,
}));

// Swagger definition
// You can set every attribute except paths and swagger
// https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md
var swaggerDefinition = {
    info: { // API informations (required)
        title: 'Geolocations Microservice', // Title (required)
        version: '0.0.1', // Version (required)
        description: 'An API endpoint to geolocate users based on their IP address', // Description (optional)
    },
    host: 'localhost:3000', // Host (optional)
    basePath: '/', // Base path (optional)
};

// Options for the swagger docs
var options = {
    // Import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // Path to the API docs
    apis: ['./routes.js'],
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
var swaggerSpec = swaggerJSDoc(options);

// Serve swagger docs the way you like (Recommendation: swagger-tools)
app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});


// Set up the routes
routes.setup(app);
// Expose app
exports = module.exports = app;

// Start the server
var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Geolocations app listening at http://%s:%s', host, port);
});
