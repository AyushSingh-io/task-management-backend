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

router.route("/:id").get(getTaskById)

router.route("/:id").patch(updateTaskById)

router.route("/:id").delete(deleteTaskById)

router.route("/:id/assign").patch(assignTask)

router.route("/:id/status").patch(updateTaskStatus)


export default router