/** @format */

const {
	launches,
	addNewLaunch,
	deleteLaunch,
	existsLaunchWithFlightNumber,
} = require("../../models/launches.model")

function getAllLaunches(req, res) {
	return res.status(200).json(Array.from(launches.values()))
}

function httpAddNewLaunch(req, res) {
	const launch = req.body
	const { mission, rocket, launchDate, target } = req.body
	if ((!mission || !rocket || !launchDate || !target) !== false)
		return res.status(400).json("Missing values")
	launch.launchDate = new Date(launch.launchDate)
	if (isNaN(launch.launchDate)) return res.status(400).json("Invalid Date")
	addNewLaunch(launch)

	return res.status(201).json(launch)
}

function httpDeleteLaunch(req, res) {
	const { flightNumber } = req.params

	if (!existsLaunchWithFlightNumber(Number(flightNumber))) {
		return res.status(404).json({
			error: "Launch not present",
		})
	}

	const aborted = deleteLaunch(Number(flightNumber))
	return res.status(200).json(aborted)
}

module.exports = {
	getAllLaunches,
	httpAddNewLaunch,
	httpDeleteLaunch,
}
