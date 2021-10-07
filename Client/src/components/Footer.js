/** @format */

import React from "react"
import { Footer as ArwesFooter, Paragraph } from "arwes"
import Centered from "./Centered"

const Footer = () => {
	return (
		<ArwesFooter animate>
			<Centered>
				<Paragraph style={{ fontSize: 14, margin: "10px 20%" }}>
					This application is built to apply the learnings of the node.js
					framework mainly.
				</Paragraph>
			</Centered>
		</ArwesFooter>
	)
}

export default Footer
