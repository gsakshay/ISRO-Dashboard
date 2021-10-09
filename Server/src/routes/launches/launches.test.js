/** @format */

const request = require("supertest")
const app = require("../../app")

describe("Test GET /launches", () => {
	test("It should respond with 200 success", async () => {
		const response = await request(app)
			.get("/launches")
			.expect(200)
			.expect("Content-Type", /json/)
	})
})

describe("Test POST /launches", () => {
	const completeLaunchData = {
		mission: "Accurating",
		rocket: "PSLV",
		target: "Kepler",
		launchDate: "January 24, 2030",
	}
	const completeLaunchDataWithoutDate = {
		mission: "Accurating",
		rocket: "PSLV",
		target: "Kepler",
	}
	test("It should respond with 201 created", async () => {
		const response = await request(app)
			.post("/launches")
			.send({
				mission: "Accurating",
				rocket: "PSLV",
				target: "Kepler",
				launchDate: "January 24, 2030",
			})
			.expect("Content-Type", /json/)
			.expect(201)

		const requestDate = new Date(completeLaunchData.launchDate).valueOf()
		const responseDate = new Date(response.body.launchDate).valueOf()

		expect(response.body).toMatchObject(completeLaunchDataWithoutDate)
		expect(responseDate).toBe(requestDate)
	})
})
