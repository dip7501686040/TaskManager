import React, { useContext, useState } from "react"
import { Button, Card, CardBody, CardFooter, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap"
import { Context, ContextType } from "../App"
import { TaskService } from "../services/task.service"
import { toast } from "react-toastify"

function TaskForm() {
  const { setTasks, taskDetails, setTaskDetails } = useContext<ContextType>(Context)
  const [isUploadModal, setIsUploadModal] = useState(false)
  const [isUploadByExcel, setIsUploadByExcel] = useState(false)
  const handleSubmit = async () => {
    if (isUploadByExcel && taskDetails.file) {
      const type = taskDetails.file.name.split(".").pop()
      if (type !== "xlsx") {
        toast.error("Please upload xlsx file")
        return
      }
      await TaskService.bulkAddByExcel(taskDetails.file)
      const tasks = await TaskService.getTasks()
      setTasks(tasks)
      setTaskDetails({
        name: "",
        details: "",
        file: null
      })
      setIsUploadByExcel(false)
    } else {
      if (!taskDetails.name || !taskDetails.details) {
        toast.error("Please enter task name and task details")
        return
      } else if (taskDetails.file) {
        const type = taskDetails.file.name.split(".").pop()
        if (type !== "pdf") {
          toast.error("Please upload pdf file")
          return
        }
      }
      TaskService.saveTask(taskDetails).then(async () => {
        toast.success("Task saved successfully")
        const tasks = await TaskService.getTasks()
        setTasks(tasks)
        setTaskDetails({
          name: "",
          details: "",
          file: null
        })
      })
    }
  }
  const handleUploadByExcel = () => {
    setIsUploadModal(!isUploadModal)
    setIsUploadByExcel(true)
    setTaskDetails({
      name: "",
      details: "",
      file: null,
      _id: ""
    })
  }
  return (
    <Card>
      <CardBody>
        <Form className="px-5">
          <FormGroup row>
            <Col lg={2}>
              <Label size="sm" for="exampleEmail">
                Name
              </Label>
            </Col>
            <Col lg={10}>
              <Input value={taskDetails.name} onChange={(e) => setTaskDetails({ ...taskDetails, name: e.target.value })} bsSize="sm" id="exampleEmail" name="email" placeholder="Enter task name..." type="text" />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col lg={2}>
              <Label size="sm" for="exampleEmail2">
                Task Details
              </Label>
            </Col>
            <Col lg={10}>
              <Input
                value={taskDetails.details}
                onChange={(e) => setTaskDetails({ ...taskDetails, details: e.target.value })}
                bsSize="sm"
                rows="3"
                id="exampleEmail2"
                name="email"
                placeholder="Enter task details..."
                type="textarea"
              />
            </Col>
          </FormGroup>
          {taskDetails.file ? (
            <Row>
              <Col lg={2}>
                <Label size="sm" for="exampleEmail2">
                  Uploaded File
                </Label>
              </Col>
              <Col>
                <p>{taskDetails?.file ? taskDetails?.file?.name : ""}</p>
              </Col>
            </Row>
          ) : (
            <></>
          )}
        </Form>
      </CardBody>
      <CardFooter style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Button
            onClick={() => {
              setIsUploadModal(true)
              setTaskDetails({ ...taskDetails, file: null })
              setIsUploadByExcel(false)
            }}
            size="sm"
            color="primary"
          >
            Attach File
          </Button>
        </div>
        <div>
          <Button onClick={handleUploadByExcel} size="sm" color="success" style={{ marginRight: "10px" }}>
            Upload By Excel
          </Button>
          <Button onClick={() => setTaskDetails({ name: "", details: "", file: null, _id: "" })} size="sm" color="danger" style={{ marginRight: "10px" }}>
            Clear
          </Button>
          <Button onClick={handleSubmit} size="sm" color="primary">
            {isUploadByExcel && taskDetails.file ? "Add By Excel" : "Save"}
          </Button>
        </div>
      </CardFooter>
      <Modal isOpen={isUploadModal}>
        <ModalHeader toggle={() => setIsUploadModal(false)}>Upload File</ModalHeader>
        <ModalBody>
          <Input
            type="file"
            onChange={(e) => {
              setTaskDetails({ ...taskDetails, file: e.target.files?.[0] })
              setIsUploadModal(false)
            }}
          />
        </ModalBody>
      </Modal>
    </Card>
  )
}

export default TaskForm
