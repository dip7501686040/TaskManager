import mongoose from "mongoose"

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  details: { type: String, required: true },
  pdfFile: { type: String, default: "" }
})

export default mongoose.model("tasks", taskSchema)
