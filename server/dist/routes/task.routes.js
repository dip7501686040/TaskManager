"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const task_controller_1 = __importDefault(require("../controllers/task.controller"));
const multer_utils_1 = __importDefault(require("../utils/multer.utils"));
const router = express_1.default.Router();
router.get("/", task_controller_1.default.getTasks);
router.get("/:id", task_controller_1.default.getTaskDetails);
router.post("/", multer_utils_1.default.single("file"), task_controller_1.default.saveTask);
router.put("/", multer_utils_1.default.single("file"), task_controller_1.default.saveTask);
router.delete("/:id", task_controller_1.default.deleteTask);
router.post("/bulkAddByExcel", multer_utils_1.default.single("file"), task_controller_1.default.bulkAddByExcel);
router.get("/downloadpdf/:id", task_controller_1.default.downloadPDF);
exports.default = router;
