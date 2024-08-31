import { Request, Response } from "express"
import TaskModel from "../models/task.schema"
import xlsx from "xlsx"
import fs from "fs"
import { promisify } from "util"
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const unlinkAsync = promisify(fs.unlink)
interface TaskControllerType {
  getTasks: (req: Request, res: Response) => Promise<void>
  getTaskDetails: (req: Request, res: Response) => Promise<void>
  saveTask: (req: Request, res: Response) => Promise<void>
  deleteTask: (req: Request, res: Response) => Promise<void>
  bulkAddByExcel: (req: Request, res: Response) => Promise<void>
  getSignedS3URL: (req: Request, res: Response) => Promise<any>
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
      const updateResponse = await TaskModel.updateOne({ _id: id }, task)
      res.status(200).json(updateResponse)
    } else {
      const insertResponse = await TaskModel.create(task)
      res.status(201).json(insertResponse)
    }
  },
  deleteTask: async (req: Request, res: Response) => {
    const task = await TaskModel.findById(req.params.id)
    const deleteResponse = await TaskModel.deleteOne({ _id: req.params.id })
    if (task?.pdfFile) {
      const clientParams = {
        region: process.env.AWS_REGION || "",
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
        }
      }
      const client = new S3Client(clientParams)
      const getObjectParams = { Bucket: process.env.AWS_BUCKET_NAME || "", Key: task.pdfFile }
      const command = new DeleteObjectCommand(getObjectParams)
      await client.send(command)
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
  getSignedS3URL: async (req: Request, res: Response) => {
    try {
      if (!req.params.filename) {
        return res.status(400).json({ error: "Filename is required" })
      } else if (!req.params.method) {
        return res.status(400).json({ error: "Method is required" })
      }
      const clientParams = {
        region: process.env.AWS_REGION || "",
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
        }
      }
      const getObjectParams = { Bucket: process.env.AWS_BUCKET_NAME || "", Key: req.params.filename }
      const client = new S3Client(clientParams)
      let command = null
      if (req.params.method === "put") {
        command = new PutObjectCommand(getObjectParams)
      } else {
        command = new GetObjectCommand(getObjectParams)
      }
      const url = await getSignedUrl(client, command, { expiresIn: 3600 })
      res.status(200).json({ url })
    } catch (error) {
      res.status(500).json({ error: "Error when when getting signed URL" })
    }
  }
}

export default controller
