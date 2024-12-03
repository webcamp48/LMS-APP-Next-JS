import mongoose, { Model, Document, Schema } from "mongoose"
import { IUser } from "./userModel";

// course Interface
interface IComment extends Document{
    user: IUser,
    question: string,
    questionReplies?: IComment[];
}
interface IReview extends Document {
    user: IUser,
    rating: number,
    comment: string,
    commentReplies?: IComment[];
}

interface ILink extends Document {
    title: string,
    url: string,
}
interface ICourseData extends Document {
    title: string,
    description: string,
    videoUrl: string,
    // videoThumbnail: object,
    videoSection: string,
    videoLength: number,
    videoPlayer: string,
    links: ILink[],
    suggestion: string,
    questions: IComment[]
}

interface ICourse extends Document {
    name : string,
    description: string,
    categories : string;
    price: number,
    estimatedPrice? : number,
    thumbnail: object,
    tags: string,
    levels: string,
    demoUrl: string,
    benefits: {title: string}[];
    prerequisites: {title: string}[],
    reviews: IReview[],
    courseData: ICourseData[]
    ratings? : number,
    purchased?: number

}

// Schema Course Model

const reviewSchema = new Schema<IReview>({
    user: Object,
    rating : {type: Number,default: 0},
    comment: String,
    commentReplies: [Object]
});

const linkSchema = new Schema<ILink>({
    title: String,
    url: String
});

const commentSchema = new Schema<IComment>({
    user: Object,
    question: String,
    questionReplies: [Object],
});

const courseDataSchema = new Schema<ICourseData>({
    videoUrl: String,
    // videoThumbnail: Object,
    title: String,
    videoSection: String,
    description: String,
    videoLength: Number,
    videoPlayer: String,
    links: [linkSchema],
    suggestion: String,
    questions: [commentSchema]
})


const courseSchema = new Schema<ICourse>({
    name: {type: String, required:true, trim:true},
    description: {type: String, required:true, trim:true},
    categories : {type : String , required : true},
    price:{type:Number, required: true},
    estimatedPrice:{type: Number},
    thumbnail: {
        public_id:{type: String, required: true},
        url: {type: String, required: true},
    },
    tags: {type:String, required: true},
    levels: {type: String, required : true},
    demoUrl: {type:String, required: false},
    benefits:{title: String},
    prerequisites: {title: String},
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    ratings: {type: Number, default: 0},
    purchased: {type: Number, default: 0},
    // courseType: {type: String, default: 'paid'},
}, {timestamps: true});

const Course = mongoose.model<ICourse>("Course", courseSchema);
export default Course;
