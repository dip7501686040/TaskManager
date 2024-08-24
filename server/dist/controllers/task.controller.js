"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_schema_1 = __importDefault(require("../models/task.schema"));
const xlsx_1 = __importDefault(require("xlsx"));
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const unlinkAsync = (0, util_1.promisify)(fs_1.default.unlink);
const controller = {
    getTasks: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const tasks = yield task_schema_1.default.find({});
        res.status(200).json(tasks);
    }),
    getTaskDetails: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const task = yield task_schema_1.default.findById(req.params.id);
        res.status(200).json(task);
    }),
    saveTask: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const task = req.body;
        if (task.file) {
            delete task.file;
        }
        if (task._id) {
            const id = task._id;
            delete task._id;
            task.pdfFile = req.file ? req.file.filename : task.pdfFile;
            const oldTask = yield task_schema_1.default.findOne({ _id: id }).select({ pdfFile: 1 });
            const updateResponse = yield task_schema_1.default.updateOne({ _id: id }, task);
            if ((oldTask === null || oldTask === void 0 ? void 0 : oldTask.pdfFile) && (oldTask === null || oldTask === void 0 ? void 0 : oldTask.pdfFile) !== task.pdfFile) {
                try {
                    yield unlinkAsync(`${__dirname}/../uploads/${oldTask.pdfFile}`);
                }
                catch (e) {
                    console.log(e);
                }
            }
            res.status(200).json(updateResponse);
        }
        else {
            task.pdfFile = req.file ? req.file.filename : "";
            const insertResponse = yield task_schema_1.default.create(task);
            res.status(201).json(insertResponse);
        }
    }),
    deleteTask: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const task = yield task_schema_1.default.findOne({ _id: req.params.id }).select({ pdfFile: 1 });
        const deleteResponse = yield task_schema_1.default.deleteOne({ _id: req.params.id });
        if (task === null || task === void 0 ? void 0 : task.pdfFile) {
            try {
                yield unlinkAsync(`${__dirname}/../uploads/${task.pdfFile}`);
            }
            catch (e) {
                console.log(e);
            }
        }
        res.status(200).json(deleteResponse);
    }),
    bulkAddByExcel: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const workbook = xlsx_1.default.readFile(req.file ? req.file.path : "");
            const sheetName = workbook.SheetNames[0];
            const sheetData = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheetName]);
            const insertResponse = yield task_schema_1.default.insertMany(sheetData);
            yield unlinkAsync(req.file ? req.file.path : "");
            res.status(201).json(insertResponse);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error when uploading file" });
        }
    }),
    downloadPDF: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const task = yield task_schema_1.default.findOne({ _id: req.params.id }).select({ pdfFile: 1 });
        const filePath = `${__dirname}/../uploads/${task === null || task === void 0 ? void 0 : task.pdfFile}`;
        res.status(200).download(filePath);
    })
};
exports.default = controller;
