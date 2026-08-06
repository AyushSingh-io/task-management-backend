import { Router } from "express";
import {
    createProject,
    getAllProjects,
    getProjectById,
    updateProjectById,
    deleteProjectById

} from "../controllers/project.controller.js"
import {
    createTask,
    getAllTasks
} from "../controllers/task.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";



const router = Router()

router.use(verifyJWT)

router.route("/")
    .post(upload.single("coverImage"), createProject)
    .get(getAllProjects)

router.route("/:id").get(getProjectById)

router.route("/:id").patch(upload.single("coverImage"), updateProjectById)

router.route("/:id").delete(deleteProjectById)

router.route("/:id/tasks").post(createTask)

router.route("/:id/tasks").get(getAllTasks)

export default router