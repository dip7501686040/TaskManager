"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
// Create an Express app
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI || "";
// middlewares
app.use(body_parser_1.default.json());
// app.use(bodyParser.urlencoded({ extended: true }))
app.use((0, cors_1.default)());
// Connect to MongoDB
const clientOptions = { serverApi: { version: "1", strict: true, deprecationErrors: true } };
mongoose_1.default
    .connect(MONGO_URI, clientOptions)
    .then(() => {
    console.log("Connected to MongoDB");
})
    .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});
// Define a routes
app.use("/api/tasks", task_routes_1.default);
// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
