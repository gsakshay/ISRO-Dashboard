/** @format */

import React from "react"

const API_HOST = "http://localhost:5000"

// Load planets and return as JSON.
async function httpGetPlanets() {
	const response = await fetch(`${API_HOST}/planets`)
	return await response.json()
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
	const response = await fetch(`${API_HOST}/launches`)
	const fetchedLaunches = await response.json()
	return fetchedLaunches.sort((a, b) => a.flightNumber - b.flightNumber)
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
	try {
		return await fetch(`${API_HOST}/launches`, {
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(launch),
		})
	} catch (e) {
		return {
			ok: false,
		}
	}
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
	try {
		return await fetch(`${API_HOST}/launches/${id}`, {
			method: "delete",
		})
	} catch {
		return {
			ok: false,
		}
	}
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch }
