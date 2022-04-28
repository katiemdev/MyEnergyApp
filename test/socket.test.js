const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");
const assert = require("chai").assert;

describe("socket.io connection test", () => {
	let io, serverSocket, clientSocket;

	before((done) => {
		const httpServer = createServer();
		io = new Server(httpServer);
		httpServer.listen(() => {
			const port = httpServer.address().port;
			clientSocket = new Client(`http://localhost:${port}`);
			io.on("connection", (socket) => {
				serverSocket = socket;
			});
			clientSocket.on("connect", done);
		});
	});

	after(() => {
		io.close();
		clientSocket.close();
	});

	it("should connect to client", (done) => {
		clientSocket.on("hello", (arg) => {
			assert.equal(arg, "world");
			done();
		});
		serverSocket.emit("hello", "world");
	});

	it("should connect to client (with callback)", (done) => {
		serverSocket.on("hi", (cb) => {
			cb("hola");
		});
		clientSocket.emit("hi", (arg) => {
			assert.equal(arg, "hola");
			done();
		});
	});
});
