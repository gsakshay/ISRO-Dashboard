/** @format */

const http = require("http")
const mongoose = require("mongoose")

const app = require("./src/app")
const { loadPlanetsData } = require("./src/models/planets.model")

const PORT = process.env.PORT || 5000
const MONGO_URL = `mongodb+srv://admin-akshay:${8050272014}@dashboard.vxjhd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

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
	server.listen(PORT, () => console.log(`Server is listening on ${PORT}`))
}

startServer()
