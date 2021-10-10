/** @format */

const launches = require("./launches.mongo")
const planets = require("./planets.mongo")

let DEFAULT_FLIGHT_NUMBER = 888

async function saveNewLaunch(launch) {
	const planet = await planets.findOne({
		keplerName: launch.target,
	})

	console.log(`The planet you selected - ${planet.keplerName}`)

	if (!planet) {
		throw new Error("No matching planet found")
	}

	await launches.updateOne(
		{
			flightNumber: launch.flightNumber,
		},

		launch,

		{
			upsert: true,
		}
	)
}

async function addNewLaunch(launch) {
	try {
		const newFlightNumber = await getLatestFlightNumber()
		console.log(newFlightNumber, "new flight number")
		const newLaunch = Object.assign(launch, {
			success: true,
			upcoming: true,
			customers: ["ISRO", "Space X"],
			flightNumber: Number(newFlightNumber),
		})
		await saveNewLaunch(newLaunch)
	} catch (err) {
		console.error(`Could not add the launch, ${err}`)
	}
}

async function getLatestFlightNumber() {
	latestLaunch = await launches.findOne().sort("-flightNumber")

	console.log(latestLaunch)
	if (!latestLaunch) return DEFAULT_FLIGHT_NUMBER
	return latestLaunch.flightNumber + 1
}

async function getAllLaunches() {
	return await launches.find(
		{},
		{
			_id: 0,
			__v: 0,
		}
	)
}

async function existsLaunchWithFlightNumber(flightNumber) {
	return await launches.findOne({
		flightNumber,
	})
}

async function deleteLaunch(flightNumber) {
	const aborted = await launches.findOneAndUpdate(
		{
			flightNumber,
		},
		{
			success: false,
			upcoming: false,
		}
	)
	return aborted
}

module.exports = {
	getAllLaunches,
	addNewLaunch,
	deleteLaunch,
	existsLaunchWithFlightNumber,
}
