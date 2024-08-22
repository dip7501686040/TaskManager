import { Request, Response } from "express"
import TaskModel from "../models/task.schema"
import xlsx from "xlsx"
import fs from "fs"
import { promisify } from "util"
const unlinkAsync = promisify(fs.unlink)
interface TaskControllerType {
  getTasks: (req: Request, res: Response) => Promise<void>
  getTaskDetails: (req: Request, res: Response) => Promise<void>
  saveTask: (req: Request, res: Response) => Promise<void>
  deleteTask: (req: Request, res: Response) => Promise<void>
  bulkAddByExcel: (req: Request, res: Response) => Promise<void>
  downloadPDF: (req: Request, res: Response) => Promise<void>
}

const controller: TaskControllerType = {
  getTasks: async (req: Request, res: Response) => {
    const tasks = await TaskModel.find({})
    res.status(200).json(tasks)
  },
  getTaskDetails: async (req: Request, res: Response) => {
    const task = await TaskModel.findById(req.params.id)
    res.status(200).json(task)
  },
  saveTask: async (req: Request, res: Response) => {
    const task = req.body
    if (task.file) {
      delete task.file
    }
    if (task._id) {
      const id = task._id
      delete task._id
      task.pdfFile = req.file ? req.file.filename : task.pdfFile
      const oldTask = await TaskModel.findOne({ _id: id }).select({ pdfFile: 1 })
      const updateResponse = await TaskModel.updateOne({ _id: id }, task)
      if (oldTask?.pdfFile && oldTask?.pdfFile !== task.pdfFile) {
        try {
          await unlinkAsync(`${__dirname}/../uploads/${oldTask.pdfFile}`)
        } catch (e) {
          console.log(e)
        }
      }
      res.status(200).json(updateResponse)
    } else {
      task.pdfFile = req.file ? req.file.filename : ""
      const insertResponse = await TaskModel.create(task)
      res.status(201).json(insertResponse)
    }
  },
  deleteTask: async (req: Request, res: Response) => {
    const task = await TaskModel.findOne({ _id: req.params.id }).select({ pdfFile: 1 })
    const deleteResponse = await TaskModel.deleteOne({ _id: req.params.id })
    if (task?.pdfFile) {
      try {
        await unlinkAsync(`${__dirname}/../uploads/${task.pdfFile}`)
      } catch (e) {
        console.log(e)
      }
    }
    res.status(200).json(deleteResponse)
  },
  bulkAddByExcel: async (req: Request, res: Response) => {
    try {
      const workbook = xlsx.readFile(req.file ? req.file.path : "")
      const sheetName = workbook.SheetNames[0]
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName])
      const insertResponse = await TaskModel.insertMany(sheetData)
      await unlinkAsync(req.file ? req.file.path : "")
      res.status(201).json(insertResponse)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Error when uploading file" })
    }
  },
  downloadPDF: async (req: Request, res: Response) => {
    const task = await TaskModel.findOne({ _id: req.params.id }).select({ pdfFile: 1 })
    const filePath = `${__dirname}/../uploads/${task?.pdfFile}`
    res.status(200).download(filePath)
  }
}

export default controller
