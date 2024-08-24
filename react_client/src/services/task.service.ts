const baseURL = process.env.REACT_APP_API_BASE_URL

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
    const res = await fetch(url, { method: "GET" })
    const tasks: Task[] = await res.json()
    return tasks
  },
  getDetail: async (id: string) => {
    let url = baseURL + "/tasks/" + id
    const res = await fetch(url, { method: "GET" })
    const task: Task = await res.json()
    return task
  },
  saveTask: async (task: Task) => {
    const formData = new FormData()
    if (task.file) {
      formData.append("file", task.file as File)
    }
    if (task._id) {
      formData.append("_id", task._id)
    }
    formData.append("name", task.name)
    formData.append("details", task.details)
    formData.append("pdfFile", task.pdfFile || "")
    let url = baseURL + "/tasks"
    const res = await fetch(url, {
      method: task._id ? "PUT" : "POST",
      body: formData
    })
    const newTask: Task = await res.json()
    return newTask
  },
  deleteTask: async (id: string) => {
    let url = baseURL + "/tasks/" + id
    await fetch(url, { method: "DELETE" })
  },
  handleDownload: async (id: string, fileName: string) => {
    fetch(`${baseURL}/tasks/downloadpdf/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/pdf"
      }
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([blob]))
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
    await fetch(baseURL + "/tasks/bulkAddByExcel", {
      method: "POST",
      body: formData
    })
  }
}
