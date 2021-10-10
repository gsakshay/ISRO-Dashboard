/** @format */

const parse = require("csv-parse")
const fs = require("fs")
const path = require("path")

const planets = require("./planets.mongo")
// const habitablePlanets = []

const isHabitablePlanet = (planet) =>
	planet["koi_disposition"] === "CONFIRMED" &&
	planet["koi_insol"] > 0.36 &&
	planet["koi_insol"] < 1.11 &&
	planet["koi_prad"] < 1.6

const loadPlanetsData = () => {
	return new Promise((resolve, reject) => {
		fs.createReadStream(
			path.join(__dirname, "..", "..", "data", "kepler_data.csv")
		)
			.pipe(
				parse({
					comment: "#",
					columns: true,
					delimiter: ",",
				})
			)
			.on("data", async (data) => {
				if (isHabitablePlanet(data)) {
					// insert + update = upsert - in mongoose
					// habitablePlanets.push(data)
					savePlanets(data)
				}
			})
			.on("error", (err) => {
				console.log(err)
				reject(err)
			})
			.on("end", async () => {
				const planetsFound = (await getAllPlanets()).length
				console.log(`${planetsFound} habitable planets`)
				// console.log(
				// 	`Habitable planets array has ${habitablePlanets.length} planets`
				// )
				resolve()
			})
	})
}

async function savePlanets(planet) {
	try {
		await planets.updateOne(
			{
				keplerName: planet.kepler_name,
			},
			{
				keplerName: planet.kepler_name,
			},
			{
				upsert: true,
			}
		)
	} catch (err) {
		console.error(`Could not save planet: ${err}`)
	}
}

async function getAllPlanets() {
	const habitablePlanets = await planets.find({})
	// console.log(`These are the planets being sent, ${habitablePlanets}`)
	return habitablePlanets
}

module.exports = {
	getAllPlanets,
	loadPlanetsData,
}
