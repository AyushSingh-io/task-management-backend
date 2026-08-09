import { Router, Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
    createComment ,
    getAllComments,
    updateComment,
    deleteComment
} from "../controllers/comment.controller.js"



const router = Router()

router.use(verifyJWT)

router.route("/tasks/:taskId").post(createComment)
router.route("/tasks/:taskId").get(getAllComments)
router.route("/:commentId").patch(updateComment)
router.route("/:commentId").delete(deleteComment)


export default router