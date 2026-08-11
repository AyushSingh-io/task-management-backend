import {Project} from "../models/project.model.js"
import ApiError from "../utilities/apiError.js"
import ApiResponse from "../utilities/apiResponse.js"
import asyncHandler from "../utilities/asyncHandler.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utilities/cloudinary.js"
import { ProjectMember } from "../models/projectMember.model.js"
import mongoose from "mongoose"
import { Task } from "../models/task.model.js"
import { Comment } from "../models/comment.model.js"



const createProject = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    const coverImageLocalPath = req.file?.path

    if (!name || !description) {
        throw new ApiError(400, "Name and description are required")
    }

    const existedProject = await Project.findOne({
        owner: req.user._id,
        name
    })

    if (existedProject) {
        throw new ApiError(400, "Project with name already exists")
    }

    //upload image 
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    //create new project and add as owner to projectMember:
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const project = await Project.create([{
            name: name,
            description: description,
            coverImage: coverImage?.url || "",
            owner: req.user._id
        }],
            { session }
        );

        console.log("project (should be as array)", project)

        const addProjectMemberasOwner = await ProjectMember.create([{
            member: req.user._id,
            project: project[0]._id,
            role: "OWNER"
        }],
            { session }
        );

        await session.commitTransaction();
        return res.status(201).json(new ApiResponse(201, project[0], "New project created successfully"))

    }

    catch (error) {

        //delete the uploaded image from cloudinary
        if (coverImage?.url)
            await deleteFromCloudinary(coverImage.url);

        await session.abortTransaction();
        throw error;
    }

    finally {
        session.endSession();
    }

})


const getAllProjects = asyncHandler(async (req, res) => {

    const projects = await Project.find({
        owner: req.user._id,
    })

    if (!projects || !projects?.length) {
        throw new ApiError(404, "Project not found")
    }

    return res.status(200).json(new ApiResponse(200, projects, "All projects fetched successfully"))

})


const getProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params

    if (!projectId) {
        throw new ApiError(400, "Project Id is required")
    }

    const project = await Project.findOne({
        owner: req.user._id,
        _id: projectId
    })

    if (!project) {
        throw new ApiError(404, "Unauthorized request or Project does not exist ")
    }

    return res.status(200).json(new ApiResponse(200, project, "Fetched project successfully"))

})


const updateProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    const { name, description , status} = req.body
    const coverImageLocalPath = req.file?.path

    if (!projectId) {
        throw new ApiError(400, "Project Id required")
    }

    if (
        name === undefined &&
        description === undefined &&
        status === undefined &&
        !coverImageLocalPath
    ) {
        throw new ApiError(400, "Nothing to update");
    }

    const existedProject = await Project.findOne({
        owner: req.user._id,
        name: name,
        _id: { $ne: projectId }
    })

    if (existedProject) {
        throw new ApiError(400, "Project with name already exists")
    }

    const project = await Project.findOne({
        _id: projectId,
        owner: req.user._id
    });

    if (!project) {
        throw new ApiError(404, "Project not found or Unauthorized request");
    }

    const oldCoverImageUrl = project.coverImage;

    const updateFields = {}

    if (name !== undefined) {
        updateFields.name = name
    }
    if (description !== undefined) {
        updateFields.description = description
    }
    if( status !== undefined){
        updateFields.status = status
    }

    let coverImage;
    if (coverImageLocalPath) {
        coverImage = await uploadOnCloudinary(coverImageLocalPath)
    }

    if (coverImage?.url) {
        updateFields.coverImage = coverImage.url

    }

    try {
        const updatedProject = await Project.findOneAndUpdate(
            {
                _id: projectId,
                owner: req.user._id
            },
            {
                $set: updateFields
            },
            {
                new: true,
                runValidators: true
            }
        )

        if (!updatedProject) {
            throw new ApiError(404, "Project not found or Unauthorized request")
        }

        //delete old coverImage:
        if (coverImage?.url) {
            await deleteFromCloudinary(oldCoverImageUrl)
        }

        return res.status(200).json(new ApiResponse(200, updatedProject, "Updated project successfully"))


    } catch (error) {
        //delete orphan file from cloudinary
        if (coverImage?.url) {
            await deleteFromCloudinary(coverImage.url);
        }

        throw error;
    }


})


const deleteProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params

    if (!projectId) {
        throw new ApiError(400, "ProjectId is required")
    }

    const session = await mongoose.startSession()

    try {
        session.startTransaction();

        //find the project:
        const project = await Project.findOne(
            {
                owner: req.user._id,
                _id: projectId,
            },
        ).session(session)

        if (!project) {
            throw new ApiError(404, "Project not found or Unauthorized request")
        }

        //delete all comments of the tasks from the project:
        const tasks = await Task.find(
            { project: projectId },
            { _id: 1 },
            { session }
        )

        const taskIds = tasks.map(task => task._id);

        await Comment.deleteMany(
            {
                task: {
                    $in: taskIds
                }
            },
            { session }
        )

        //delete tasks of the project:
        await Task.deleteMany(
            { project: projectId },
            { session }
        )

        //delete all members of the project:
        await ProjectMember.deleteMany(
            {
                project: projectId,
            },
            { session }
        )

        //delete the project :
        await Project.deleteOne(
            { _id: projectId },
            { session }
        )


        await session.commitTransaction();

        //delete cloudinary file:
        if (project.coverImage)
            await deleteFromCloudinary(project.coverImage)

        return res.status(200).json(new ApiResponse(200, project, "Deleted project successfully"))

    }

    catch (error) {
        await session.abortTransaction();
        throw error;
    }

    finally {
        session.endSession()
    }

})


export {
    createProject,
    getAllProjects,
    getProjectById,
    updateProjectById,
    deleteProjectById
}