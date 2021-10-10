/** @format */

const {
	getAllLaunches,
	addNewLaunch,
	deleteLaunch,
	existsLaunchWithFlightNumber,
} = require("../../models/launches.model")

async function httpGetAllLaunches(req, res) {
	return res.status(200).json(await getAllLaunches())
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

async function httpDeleteLaunch(req, res) {
	const { flightNumber } = req.params

	const existsLaunch = await existsLaunchWithFlightNumber(Number(flightNumber))
	if (!existsLaunch) {
		return res.status(404).json({
			error: "Launch not present",
		})
	}

	const aborted = await deleteLaunch(Number(flightNumber))

	if (!aborted) return res.status(400).json("Could not delet")

	return res.status(200).json(aborted)
}

module.exports = {
	httpGetAllLaunches,
	httpAddNewLaunch,
	httpDeleteLaunch,
}
