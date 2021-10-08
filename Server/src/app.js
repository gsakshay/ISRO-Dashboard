/** @format */

const express = require("express")
const cors = require("cors")
const path = require("path")
const morgan = require("morgan")

const planetsRouter = require("./routes/planets/planets.router")
const launchesRouter = require("./routes/launches/launches.router")

const app = express()

app.use(
	cors({
		origin: "http://localhost:3000",
	})
)
app.use(morgan("combined"))
app.use(express.json(__dirname, "..", "public"))
app.use(express.static(path.join()))
app.use("/planets", planetsRouter)
// app.get("/*", (req, res) => {
// 	res.sendFile(path.join(__dirname, "..", "public", "build", "index.html"))
// })
app.use("/launches", launchesRouter)

module.exports = app
