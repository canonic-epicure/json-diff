import { globalGraph } from "@bryntum/chronograph/src/chrono2/graph/Graph.js"
import { Application } from "./src/Application.js"

globalGraph.autoCommit      = true
globalGraph.historyLimit    = 0

const app   = Application.new()

document.body.appendChild(app.el)
