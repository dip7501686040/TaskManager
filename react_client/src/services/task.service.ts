import axios from "axios"
const baseURL = process.env.REACT_APP_API_URL

export interface TaskType {
  name: string
  details: string
  pdfFile?: string | null
  _id?: string
  file?: File | null
}
export class Task {
  name: string
  details: string
  _id?: string
  file?: File | null
  pdfFile?: string | null
  constructor({ _id, name, details, file, pdfFile }: TaskType) {
    this._id = _id
    this.name = name
    this.details = details
    this.file = file
    this.pdfFile = pdfFile
  }
}

export const TaskService = {
  getTasks: async () => {
    let url = baseURL + "/tasks"
    const res = await axios(url, { method: "GET" })
    const tasks: Task[] = await res.data
    return tasks
  },
  getDetail: async (id: string) => {
    let url = baseURL + "/tasks/" + id
    const res = await axios(url, { method: "GET" })
    const task: Task = await res.data
    return task
  },
  saveTask: async (task: Task) => {
    const fileData = new FormData()
    if (task.file) {
      const uploadedFileName = `${Date.now()}-${task.file?.name}`
      task.pdfFile = uploadedFileName
      fileData.append("file", task.file as File)
      const signedS3uploadURL = await axios.get(`${baseURL}/tasks/getSignedS3URL/put/${uploadedFileName}`)
      await axios.put(signedS3uploadURL.data.url, task.file)
    }
    const formData: TaskType = {
      name: task.name,
      details: task.details,
      pdfFile: task.pdfFile || ""
    }
    if (task._id) {
      formData["_id"] = task._id
    }
    let url = baseURL + "/tasks"
    const res = await axios(url, {
      method: task._id ? "PUT" : "POST",
      data: formData
    })
    const newTask: Task = await res.data
    return newTask
  },
  deleteTask: async (id: string) => {
    let url = baseURL + "/tasks/" + id
    await axios(url, { method: "DELETE" })
  },
  handleDownload: async (id: string, fileName: string) => {
    const signedS3uploadURL = await axios.get(`${baseURL}/tasks/getSignedS3URL/get/${fileName}`)
    await axios({ url: signedS3uploadURL.data.url, method: "GET", responseType: "blob" }).then((response) => {
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", fileName)
      document.body.appendChild(link)
      link.click()
      // Clean up and remove the link
      if (link.parentNode) {
        link.parentNode.removeChild(link)
      }
    })
  },
  bulkAddByExcel: async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    await axios.post(baseURL + "/tasks/bulkAddByExcel", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  }
}
