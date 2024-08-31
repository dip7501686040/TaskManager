import express from "express"
import controller from "../controllers/task.controller"
import upload from "../utils/multer.utils"
const router = express.Router()
router.get("/", controller.getTasks)
router.get("/:id", controller.getTaskDetails)
router.post("/", controller.saveTask)
router.put("/", controller.saveTask)
router.delete("/:id", controller.deleteTask)
router.post("/bulkAddByExcel", upload.single("file"), controller.bulkAddByExcel)
router.get("/getSignedS3URL/:method/:filename", controller.getSignedS3URL)
export default router
