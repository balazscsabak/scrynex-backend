const express = require("express");
const uuidAPIKey = require("uuid-apikey");
const APIHandler = require("./lib/middlewares/APIHandler");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const cors = require('cors');

const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const servicesRoutes = require('./routes/servicesRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3333;

app.use(cookieParser());
app.use(express.json());
app.use(morgan('combined'))
app.use(cors({
	origin: 'http://localhost:3000',
	credentials: true
}))

mongoose.connect("mongodb://root:root@localhost:27017/screenx?authSource=admin", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
	console.log("connected");
});

/**
 * API Auth routes
 */
app.use("/api/auth", authRoutes);

/**
 * API Session routes
 */
app.use("/api/sessions", sessionRoutes);

/**
 * API Service routes
 */
app.use("/api/services", servicesRoutes);

app.listen(port, () => {
	console.log("server started");
});
