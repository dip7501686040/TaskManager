import express from "express"
import controller from "../controllers/task.controller"
import upload from "../utils/multer.utils"
const router = express.Router()
router.get("/", controller.getTasks)
router.get("/:id", controller.getTaskDetails)
router.post("/", upload.single("file"), controller.saveTask)
router.put("/", upload.single("file"), controller.saveTask)
router.delete("/:id", controller.deleteTask)
router.post("/bulkAddByExcel", upload.single("file"), controller.bulkAddByExcel)
router.get("/downloadpdf/:id", controller.downloadPDF)
export default router
