import mongoose, {Document} from "mongoose";

// notification interface
export interface Notification extends Document {
    title : string;
    message : string;
    status : string;
    userId : string;
}

const notificationSchema = new mongoose.Schema<Notification> ({
    title : {type : String, required : true, trim: true},
    message : {type : String, required : true, trim: true},
    status : {type : String, required : true, default : "unread"},

}, {timestamps : true});

const Notification = mongoose.model<Notification>("Notification", notificationSchema);

export default Notification;