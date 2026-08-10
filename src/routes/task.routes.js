import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
    getTaskById,
    updateTaskById,
    deleteTaskById,
    assignTask,
    updateTaskStatus,
    getAllAssignedTasks

} from "../controllers/task.controller.js"



const router = Router()

router.use(verifyJWT)

router.route("/").get(getAllAssignedTasks)

router.route("/:taskId").get(getTaskById)

router.route("/:taskId").patch(updateTaskById)

router.route("/:taskId").delete(deleteTaskById)

router.route("/:taskId/assign").patch(assignTask)

router.route("/:taskId/status").patch(updateTaskStatus)


export default router