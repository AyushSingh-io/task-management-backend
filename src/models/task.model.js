import mongoose , {Schema} from "mongoose";

const taskSchema = new Schema({
    name : {
        type : String,
        required : true,
        trim : true,
    },

    description : {
        type : String,
        required : true,
        trim : true
    },

    project : {
        type : Schema.Types.ObjectId,
        ref : "Project",
        required : true
    },

    status : {
        type : String,
        enum: ["TODO", "IN_PROGRESS", "DONE"],
        default : "TODO"
    },

    priority : {
        type : String,
        enum : ["LOW", "MEDIUM" , "HIGH"],
        default : "MEDIUM"
    },

    assignedTo : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },

    dueDate : {
        type : Date,
    },

    completedAt : {
        type : Date,
        default : null
    }


} , {timestamps : true})

export const Task = mongoose.model("Task", taskSchema)