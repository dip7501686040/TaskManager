import React, { useContext, useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import { ArrowDownCircle, Delete, Edit, Trash } from "react-feather"
import { Badge, Card, CardBody, Col, ListGroup, ListGroupItem, Row, Spinner } from "reactstrap"
import { Task, TaskService } from "../services/task.service"
import { Context, ContextType } from "../App"
import { toast } from "react-toastify"
import Swal from "sweetalert2"

function TaskList() {
  const { tasks, setTasks, taskDetails, setTaskDetails } = useContext<ContextType>(Context)
  const [loading, setLoading] = useState(true)

  const getTasks = async () => {
    const tasks = await TaskService.getTasks()
    setTasks(tasks)
    setLoading(false)
  }
  const handleDeleteTask = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await TaskService.deleteTask(id)
        getTasks()
        toast.success("Task deleted successfully")
      }
    })
  }
  const handleEditTask = async (id: string) => {
    const task = await TaskService.getDetail(id)
    setTaskDetails(task)
  }
  const handleDownload = async (id: string, fileName: string) => {
    if (fileName) {
      await TaskService.handleDownload(id, fileName)
    } else {
      toast.error("File not found")
    }
  }
  useEffect(() => {
    getTasks()
  }, [])
  const conditionalRowStyles = [
    {
      when: (row: Task) => row._id === taskDetails?._id,
      style: {
        backgroundColor: "#e1e2e3"
      }
    },
    {
      when: (row: Task) => row._id !== taskDetails?._id,
      style: {
        backgroundColor: "white",
        color: "black"
      }
    }
  ]
  const columns = [
    {
      name: (
        <h6>
          <Badge color="secondary">Name</Badge>
        </h6>
      ),
      selector: (row: Task) => row.name
    },
    {
      name: (
        <h6>
          <Badge color="secondary">Task Details</Badge>
        </h6>
      ),
      grow: 2,
      maxWidth: "700px",
      hide: 1380,
      selector: (row: Task) => row.details
    },
    {
      name: (
        <h6>
          <Badge color="secondary">PDF File</Badge>
        </h6>
      ),
      hide: 1530,
      selector: (row: Task) => row.pdfFile || ""
    },
    {
      name: (
        <h6>
          <Badge color="secondary">Download Attached File</Badge>
        </h6>
      ),
      center: true,
      cell: (row: any) => (
        <div style={{ display: "flex" }}>
          <ArrowDownCircle size={20} style={{ cursor: "pointer", marginRight: "10px", color: "rgb(25, 135, 84)" }} onClick={() => handleDownload(row._id, row.pdfFile)} />
          <Edit size={20} style={{ cursor: "pointer", marginRight: "10px", color: "#0d6efd" }} onClick={() => handleEditTask(row._id)} />
          <Trash size={20} style={{ cursor: "pointer", color: "#dc3545" }} onClick={() => handleDeleteTask(row._id)} />
        </div>
      )
    }
  ]

  return (
    <Row className="mt-3">
      <Col md={2}></Col>
      <Col md={8}>
        <DataTable responsive columns={columns} data={tasks} pagination progressPending={loading} progressComponent={<Spinner style={{ marginTop: "20px" }} />} conditionalRowStyles={conditionalRowStyles} />
      </Col>
      <Col md={2}></Col>
    </Row>
  )
}

export default TaskList
