/** @format */

const http = require("http")
const mongoose = require("mongoose")
require("dotenv").config()

const app = require("./src/app")
const { loadPlanetsData } = require("./src/models/planets.model")
const { loadSpaceXLaunches } = require("./src/models/launches.model")

const PORT = process.env.PORT || 5000
const MONGO_URL = process.env.MONGO_URL

const server = http.createServer(app)

mongoose.connection.once("open", () => {
	console.log("MongoDB connection successful")
})
mongoose.connection.on("error", (err) => console.error(err))

async function startServer() {
	await mongoose.connect(MONGO_URL, {
		// acknowledging depreicarion warnings
		useNewUrlParser: true,
		// useFindAndModify: false,
		// useCreateIndex: true,
		useUnifiedTopology: true,
	})
	await loadPlanetsData()
	await loadSpaceXLaunches()
	server.listen(PORT, () => console.log(`Server is listening on ${PORT}`))
}

startServer()
