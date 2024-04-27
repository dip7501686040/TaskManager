import express, { Request, Response } from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import cors from "cors"
import testRoutes from "./routes/task.routes"
import dotenv from "dotenv"

// Create an Express app
const app = express()
const port = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://dip7501686040:ASDasd278@cluster0.alyonrh.mongodb.net/TaskManager?retryWrites=true&w=majority&appName=Cluster0"

// middlewares
dotenv.config()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
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
