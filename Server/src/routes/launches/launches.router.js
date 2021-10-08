/** @format */

const express = require("express")

const {
	getAllLaunches,
	httpAddNewLaunch,
	httpDeleteLaunch,
} = require("./launches.controller")

const launchesRouter = express.Router()

launchesRouter.get("/", getAllLaunches)
launchesRouter.post("/", httpAddNewLaunch)
launchesRouter.delete("/:flightNumber", httpDeleteLaunch)

module.exports = launchesRouter
