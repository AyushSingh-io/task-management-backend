import mongoose , {Schema} from "mongoose";

const commentSchema = new Schema({
    content : {
        type : String,
        required : true,
        trim : true,
        maxlength : 1000
    },

    task : {
        type : Schema.Types.ObjectId,
        ref : "Task",
        required: true
    },

    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required: true
    }

} , {timestamps : true})

export const Comment = mongoose.model("Comment", commentSchema)