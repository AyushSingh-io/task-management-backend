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

import {
    addMember,
    removeMember,
    changeMemberRole,
    getMember,
    getAllMembers
} from "../controllers/projectMember.controller.js"

import verifyJWT from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";



const router = Router()

router.use(verifyJWT)

router.route("/")
    .post(upload.single("coverImage"), createProject)
    .get(getAllProjects)

router.route("/:projectId").get(getProjectById)
router.route("/:projectId").patch(upload.single("coverImage"), updateProjectById)
router.route("/:projectId").delete(deleteProjectById)

router.route("/:projectId/tasks").post(createTask)
router.route("/:projectId/tasks").get(getAllTasks)

router.route("/:projectId/members/:memberId").post(addMember)
router.route("/:projectId/members/:memberId").delete(removeMember)
router.route("/:projectId/members/:memberId").patch(changeMemberRole)
router.route("/:projectId/members/:memberId").get(getMember)
router.route("/:projectId/members").get(getAllMembers)

export default router