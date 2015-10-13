var Hapi = require('hapi');

// Configure & start TS HTTP-to-WS proxy
var TSWS = require('thingsee-simple-ws-proxy');
var settings = {
    wsPort:     8001,
    httpPort:   8000,
    //httpHost:   '10.10.0.50',
    apiPath:    '/api/{any?}'
}
var ws = TSWS.listen(settings);

// Start a web server to serve the web app
var server = new Hapi.Server();
server.connection({
    //host: '',
    port: 8080
});

server.register(require('inert'), function(err) {
    if (err) {
        throw err;
    }

    server.route({
        method: 'GET',
        path: '/',
        handler: {
            file: 'dist/index.html'
        }
    });


    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: 'dist'
            }
        }
    });

    // Start the server
    server.start(function() {
        console.log('Server running at:', server.info.uri);
    });

});