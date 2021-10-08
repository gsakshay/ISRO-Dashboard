/** @format */

// JS map objects

const launches = new Map()
let latestFlightNumber = 888

function addNewLaunch(launch) {
	latestFlightNumber++
	launches.set(
		latestFlightNumber,
		Object.assign(launch, {
			flightNumber: latestFlightNumber,
			customer: ["ISRO", "SpaceX"],
			upcoming: true,
			success: true,
		})
	)
}

function existsLaunchWithFlightNumber(flightNumber) {
	return launches.has(flightNumber)
}

function deleteLaunch(flightNumber) {
	const aborted = launches.get(flightNumber)
	aborted.upcoming = false
	aborted.success = false
	return aborted
}

module.exports = {
	launches,
	addNewLaunch,
	deleteLaunch,
	existsLaunchWithFlightNumber,
}
