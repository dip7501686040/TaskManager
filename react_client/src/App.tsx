import React, { useState } from "react"
import "./App.css"
import TaskList from "./components/TaskList"
import TaskForm from "./components/TaskForm"
import { Col, Row } from "reactstrap"
import { Task } from "./services/task.service"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export interface ContextType {
  tasks: Task[]
  setTasks: any
  isEditTask: string | null
  setIsEditTask: any
  isDeleteTask: string | null
  setIsDeleteTask: any
  taskDetails: Task
  setTaskDetails: any
  loading: boolean
  setLoading: any
}
export const Context = React.createContext({
  tasks: [],
  setTasks: () => {},
  isEditTask: null,
  setIsEditTask: () => {},
  isDeleteTask: null,
  setIsDeleteTask: () => {},
  taskDetails: {
    name: "",
    details: "",
    file: null
  },
  setTaskDetails: () => {},
  loading: true,
  setLoading: () => {}
} as ContextType)
function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isEditTask, setIsEditTask] = useState<string | null>(null)
  const [isDeleteTask, setIsDeleteTask] = useState<string | null>(null)
  const [taskDetails, setTaskDetails] = useState<Task>({
    name: "",
    details: "",
    file: null
  })
  const [loading, setLoading] = useState(true)

  return (
    <Context.Provider
      value={{
        tasks,
        setTasks,
        isEditTask,
        setIsEditTask,
        isDeleteTask,
        setIsDeleteTask,
        taskDetails,
        setTaskDetails,
        loading,
        setLoading
      }}
    >
      <div className="App">
        <h3 className="text-2xl font-bold underline text-red-600 text-center mt-1">Task Manager</h3>
        <Row>
          <Col sm={2}></Col>
          <Col sm={8}>
            <TaskForm />
          </Col>
          <Col sm={2}></Col>
        </Row>
        <TaskList />
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      </div>
    </Context.Provider>
  )
}

export default App
