import { ProjectMember } from "../models/projectMember.model.js";
import { Task } from "../models/task.model.js";


const getProjectUserRole  = async (projectId , userId) => {
    if(!projectId || !userId){
        return "NON_MEMBER"
    }

    const projectUser = await ProjectMember.findOne({
        member : userId,
        project : projectId
    })

    if(!projectUser){
        return "NON_MEMBER"
    }

    return projectUser.role
}


const isTaskAssigned  =  (task , userId) => { 
    if(!task || !userId){
        return false
    }

    if(!task.assignedTo?.equals(userId)) return false
    return true
}

export {
    getProjectUserRole,
    isTaskAssigned
}