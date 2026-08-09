
import { Task } from "../models/task.model.js"
import { ProjectMember } from "../models/projectMember.model.js"
import ApiError from "../utilities/apiError.js"
import ApiResponse from "../utilities/apiResponse.js"
import asyncHandler from "../utilities/asyncHandler.js"
import { getProjectUserRole } from "../services/permission.service.js"
import { User } from "../models/user.model.js"
import mongoose from "mongoose"
import { Project } from "../models/project.model.js"



const addMember = asyncHandler(async (req, res) => {
    const { projectId, memberId } = req.params

    if (!projectId || !memberId) {
        throw new ApiError(400, "ProjectId and memberId are required")
    }

    const isAuthorized = await getProjectUserRole(projectId, req.user._id)
    if (isAuthorized !== "OWNER" && isAuthorized !== "ADMIN") {
        throw new ApiError(403, "Unauthorized request")
    }

    const isUserExist = await User.findById(memberId)
    if (!isUserExist) {
        throw new ApiError(404, "User does not exist")
    }

    const isAlreadyMember = await getProjectUserRole(projectId, memberId)
    if (isAlreadyMember !== "NON_MEMBER") {
        throw new ApiError(400, "Member already exists in the project")
    }

    const addedMember = await ProjectMember.create({
        project: projectId,
        member: memberId,
        role: "MEMBER"
    })

    return res.status(201).json(new ApiResponse(201, addedMember, "Add member to the project successfully"))

})


const removeMember = asyncHandler(async (req, res) => {
    const { projectId, memberId } = req.params

    if (!projectId || !memberId) {
        throw new ApiError(400, "ProjectId and memberId are required")
    }

    const isAuthorized = await getProjectUserRole(projectId, req.user._id)
    if (isAuthorized !== "OWNER" && isAuthorized !== "ADMIN") {
        throw new ApiError(403, "Unauthorized request")
    }

    const isUserExist = await User.findById(memberId)
    if (!isUserExist) {
        throw new ApiError(404, "User does not exist")
    }

    const memberRoleInProject = await getProjectUserRole(projectId, memberId)
    if (memberRoleInProject === "NON_MEMBER") {
        throw new ApiError(400, "Member does not exist in the project")
    }

    if (memberRoleInProject === "OWNER") {
        throw new ApiError(400, "Cannot remove the owner of the project")
    }

    if (isAuthorized === "ADMIN" && memberRoleInProject === "ADMIN") {
        throw new ApiError(400, "Not Allowed to remove the admin ")
    }

    const removedMember = await ProjectMember.findOneAndDelete({
        project: projectId,
        member: memberId
    })

    return res.status(200).json(new ApiResponse(200, removedMember, "Remove the member from the project successfully"))

})


const changeMemberRole = asyncHandler(async (req, res) => {
    const { projectId, memberId } = req.params
    const { role } = req.body

    if (!projectId || !memberId) {
        throw new ApiError(400, "ProjectId and memberId are required")
    }

    if (role !== "MEMBER" && role !== "ADMIN" && role !== "OWNER") {
        throw new ApiError(400, "Invalid role")
    }

    const isAuthorized = await getProjectUserRole(projectId, req.user._id)
    if (isAuthorized !== "OWNER") {
        throw new ApiError(403, "Unauthorized request")
    }

    const isUserExist = await User.findById(memberId)
    if (!isUserExist) {
        throw new ApiError(404, "User does not exist")
    }

    const memberRoleInProject = await getProjectUserRole(projectId, memberId)
    if (memberRoleInProject === "NON_MEMBER") {
        throw new ApiError(400, "Member does not exist in the project")
    }

    if (memberRoleInProject === "OWNER") {
        throw new ApiError(400, "Cannot change role of the owner")
    }

    if (memberRoleInProject === role) {
        const member = await ProjectMember.findOne({
            project: projectId,
            member: memberId
        })

        return res.status(200).json(
            new ApiResponse(200, member, "Member already has this role")
        )
    }

    if (role !== "OWNER") {
        const member = await ProjectMember.findOneAndUpdate(
            {
                project: projectId,
                member: memberId,
            },
            {
                $set: {
                    role: role
                }
            },
            {
                new: true,
                runValidators: true
            }
        )

        return res.status(200).json(new ApiResponse(200, member, "Role changed successfully"))
    }

    //todo : transction for tranfer ownership if (role == "OWNER")

    const session = await mongoose.startSession();

    try {
        session.startTransaction()

        const newOwner = await ProjectMember.findOneAndUpdate(
            {
                project: projectId,
                member: memberId
            },
            {
                $set: {
                    role: "OWNER"
                }
            },
            {
                new: true,
                runValidators: true,
                session
            }
        );

        const oldOwner = await ProjectMember.findOneAndUpdate(
            {
                project: projectId,
                member: req.user._id,
            },
            {
                $set: {
                    role: "MEMBER"
                }
            },
            {
                new: true,
                runValidators: true,
                session
            }
        );

        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            {
                $set: {
                    owner: memberId
                }
            },
            {
                new: true,
                runValidators: true,
                session
            }
        );

        await session.commitTransaction()

        return res.status(200).json(new ApiResponse(200, newOwner, "Ownership transferred successfully"))

    } catch (error) {

        await session.abortTransaction()
        throw  error

    } finally {
        session.endSession()
    }


})


const getMember = asyncHandler(async (req, res) => {
    const { projectId, memberId } = req.params

    if (!projectId || !memberId) {
        throw new ApiError(400, "ProjectId and memberId are required")
    }

    const isAuthorized = await getProjectUserRole(projectId, req.user._id)
    if (isAuthorized !== "OWNER" && isAuthorized !== "ADMIN") {
        throw new ApiError(403, "Unauthorized request")
    }

    const isUserExist = await User.findById(memberId)
    if (!isUserExist) {
        throw new ApiError(404, "User does not exist")
    }

    const memberRoleInProject = await getProjectUserRole(projectId, memberId)
    if (memberRoleInProject === "NON_MEMBER") {
        throw new ApiError(400, "Member does not exist in the project")
    }

    const memberInfo = await ProjectMember.findOne({
        project: projectId,
        member: memberId
    }).populate("member", "-refreshToken")

    return res.status(200).json(new ApiResponse(200, memberInfo, "Fetched member successfully"))

})


const getAllMembers = asyncHandler(async (req, res) => {
    const { projectId } = req.params

    if (!projectId) {
        throw new ApiError(400, "ProjectId is required")
    }

    const isAuthorized = await getProjectUserRole(projectId, req.user._id)
    if (isAuthorized !== "OWNER" && isAuthorized !== "ADMIN") {
        throw new ApiError(403, "Unauthorized request")
    }

    const membersInfo = await ProjectMember.find({
        project: projectId
    }).populate("member", "-refreshToken")

    return res.status(200).json(new ApiResponse(200, membersInfo, "Fetched all members successfully"))

})


export {
    addMember,
    removeMember,
    changeMemberRole,
    getMember,
    getAllMembers
}