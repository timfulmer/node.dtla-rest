/**
 * Created by tim on 9/8/14.
 */

var restify= require('restify'),
    server= restify.createServer();

// configure restify server
server.use(restify.fullResponse())
    .use(restify.bodyParser());
server.name= 'Node.DTLA';

// delegate to setup routes
require('./gadget')
    .route(server);
require('./widget')
    .route(server);

// start server
function listenOnPort() {
    console.log('%s listening on %s.', server.name, server.url);
}
server.listen(3000, listenOnPort);