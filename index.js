const app = require('./app');
const debug = require('debug')('api:server');
const http = require('http');
const redis = require('socket.io-redis');
const port = normalizePort(process.env.PORT || '9200');
const server = http.createServer(app);
app.set('port', port);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) { return val; }
    if (port >= 0) { return port; }
    return false;
}
function onError(error) {
    if (error.syscall !== 'listen') { throw error; }
    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES': console.error(bind + ' requires elevated privileges'); process.exit(1); break; case 'EADDRINUSE': console.error(bind + ' is already in use'); process.exit(1); break; default: throw error;
    }
}
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port; debug('Listening on ' + bind);
}
const io = require('socket.io').listen(server)
io.adapter(redis({ host: 'localhost', port: 6379 }));
io.on("connection",(socket)=>{
    console.log("un utilisateur connecté avec l'id : " + socket.id);
    socket.on("files_update",()=>{io.emit("files_update")})
    socket.emit("ok")
})
console.log(`start on port : ${port}`);
module.exports = io