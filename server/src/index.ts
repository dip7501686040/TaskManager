import express, { Request, Response } from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import cors from "cors"
import testRoutes from "./routes/task.routes"

// Create an Express app
const app = express()
const port = process.env.PORT || 8000
const MONGO_URI = process.env.MONGO_URI || ""

// middlewares
app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// Connect to MongoDB
const clientOptions: any = { serverApi: { version: "1", strict: true, deprecationErrors: true } }
mongoose
  .connect(MONGO_URI, clientOptions)
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch((error: Error) => {
    console.error("Error connecting to MongoDB:", error)
  })

// Define a routes
app.use("/api/tasks", testRoutes)

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
