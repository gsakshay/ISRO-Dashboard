/** @format */

const launches = require("./launches.mongo")
const planets = require("./planets.mongo")

const axios = require("axios")

let DEFAULT_FLIGHT_NUMBER = 888
const SPACE_X_URL = "https://api.spacexdata.com/v4/launches/query"

// flight_number
// rocket.name
// name = mission name
// date_local = launch
// upcoming
// success
// customers = playload.customers for each playload

async function findLaunch(filter) {
	return await launches.findOne(filter)
}

async function saveLaunch(launch) {
	await launches.findOneAndUpdate(
		{
			flightNumber: Number(launch.flightNumber),
		},

		launch,

		{
			upsert: true,
		}
	)
}

async function loadSpaceXLaunches() {
	const response = await axios.post(SPACE_X_URL, {
		query: {},
		options: {
			pagination: false,
			populate: [
				{
					path: "rocket",
					select: {
						name: 1,
					},
				},
				{
					path: "payloads",
					select: {
						customers: 1,
					},
				},
			],
		},
	})

	if (response.status !== 200) {
		console.log("There was a problem in downloading data")
		throw new Error("Launch data download failed")
	}

	const launchDocs = response.data.docs
	for (const launchDoc of launchDocs) {
		const payloads = launchDoc["payloads"]
		const customersArray = payloads.map((payload) => payload.customers)
		const customers = customersArray.flat()
		const launch = {
			flightNumber: launchDoc["flight_number"],
			mission: launchDoc["name"],
			rocket: launchDoc["rocket"]["name"],
			launchDate: launchDoc["date_local"],
			upcoming: launchDoc["upcoming"],
			success: launchDoc["success"],
			customers,
		}
		const firstLaunch = await findLaunch({
			flightNumber: launch.flightNumber,
		})
		if (firstLaunch) {
			console.log(`${firstLaunch.mission} is already available`)
		} else {
			await saveLaunch(launch)
		}
	}
}

async function saveNewLaunch(launch) {
	const planet = await planets.findOne({
		keplerName: launch.target,
	})

	console.log(`The planet you selected - ${planet.keplerName}`)

	if (!planet) {
		throw new Error("No matching planet found")
	} else {
		saveLaunch(launch)
	}
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
	return await launches
		.find(
			{},
			{
				_id: 0,
				__v: 0,
			}
		)
		.sort({ flightNumber: 1 })
}

async function existsLaunchWithFlightNumber(flightNumber) {
	return await findLaunch({
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
	loadSpaceXLaunches,
	getAllLaunches,
	addNewLaunch,
	deleteLaunch,
	existsLaunchWithFlightNumber,
}
