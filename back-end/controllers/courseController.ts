import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import { Request, Response, NextFunction } from 'express';
import cloudinary from 'cloudinary';
import ejs  from 'ejs';
import mongoose from "mongoose";
import ErrorHandler from "../utils/ErrorHandler";

import { createCourse } from "../services/LMS_Services/course.Services";
import Course from "../models/courseModel";
import { redis } from "../utils/redis";
import path from "path";
import sendMail from "../services/email/sendMail";
import Notification from "../models/notificationModel";
import { EXPIRE_AFTER_7_DAYS } from "../constants/constant-varible";
import axios from "axios";

// upload course handler
export const uploadsCourse = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;

        if (thumbnail) {
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses",
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            };
        }

        // pass data to create a course
        await createCourse(data, res, next); 
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// =================================================================
// =================================================================

// update course handler
export const updateCourse = CatchAsyncErrors(async(req: Request, res: Response, next:NextFunction)=> {
    try {
        const courseId = req.params.id;
        const data = req.body;
        const thumbnail = data.thumbnail;

        const courseData = await Course.findById(courseId) as any; 

        if(thumbnail && !thumbnail.startsWith("https")){
            await cloudinary.v2.uploader.destroy(courseData.thumbnail.public_id);

            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses",
            })
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        }

        if(thumbnail.startsWith("https")) {
            data.thumbnail = {
                public_id: courseData?.thumbnail.public_id,
                url: courseData?.thumbnail.url,
            }
        }
        // pass data to update a course
        const course = await Course.findByIdAndUpdate(courseId, {
            $set: data,
        }, {new: true});

        if(!course) {
            return next(new ErrorHandler('Course not found', 404));
        }

        res.status(201).json({success: true, message :"Course updated successfully!", course});

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})

// =================================================================
// =================================================================

// GET SINGLE COURSE  === WITHOUT PURCHASING COURSE
export const getSingleCourse = CatchAsyncErrors(async(req: Request, res: Response, next:NextFunction)=> {
    try {
        const courseId = req.params.id
        const isCacheExist = await redis.get(courseId);
        
        if(isCacheExist){
            // fetch course data in redis db
            const course = JSON.parse(isCacheExist);
            return res.status(200).json({success: true, course});
        }else{
            // fetch course data in mongo db
            const course = await Course.findById(courseId).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
            if(!course) {
                return next(new ErrorHandler('Course not found', 404));
            }
            // set course data in redis for cache  so fast fetch course data
            // AND If user active then not session expire and if user nit active then automatic this course are expire from redis so not display to user
            await redis.set(courseId, JSON.stringify(course), 'EX', EXPIRE_AFTER_7_DAYS); //7DAYS
            res.status(200).json({success: true, course});
        }


    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
});

// =================================================================
// =================================================================

// GET All COURSE  === WITHOUT PURCHASING COURSE for user 
export const getAllCourse = CatchAsyncErrors(async(req: Request, res: Response, next:NextFunction)=> {
    try {
        // fetch course data from mongo db
        const course = await Course.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
        if(!course) {
            return next(new ErrorHandler('Course not found', 404));
        }
        res.status(200).json({success: true, course});

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
});

// =================================================================
// =================================================================

// get course content ===== only for valid user access this course
export const getCourseByUserId = CatchAsyncErrors(async(req: Request, res: Response, next:NextFunction)=>{
    try {
        const courseId = req.params.id;
        const userCourseList = req.user?.courses;
        const isCourseExist = userCourseList?.find((course: any) => course._id === courseId);
        if(!isCourseExist) {
            return next(new ErrorHandler('You do not have access to this course', 403));
        }
        // fetch course data in mongo db
        const course = await Course.findById(courseId);
        const courseContent = course?.courseData;
        res.status(200).json({success: true, courseContent});
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})


// =================================================================
// =================================================================


// Add question in Course Interface
interface IAddQuestionData {
    question: string;
    courseId: string;
    contentId: string;
}
// Add question in Course handler 
export const addQuestion = CatchAsyncErrors(async(req: Request, res: Response, next:NextFunction)=> {
    try {
        const {question, courseId, contentId } : IAddQuestionData = req.body;
        const course = await Course.findById(courseId);

        if(!mongoose.Types.ObjectId.isValid(contentId)){
            return next(new ErrorHandler('Invalid content id', 400))
        }
        const courseContent = course?.courseData?.find((item:any) => item._id.equals(contentId));
        if(!courseContent){
            return next(new ErrorHandler('Invalid content id', 400))
        }
        // create a new Question object
        const newQuestion: any = {
            user: req.user,
            question,
            questionReplies: []
        }
        // add question to course content
        courseContent?.questions.push(newQuestion);

        // send notification to admin from user side
        await Notification.create({
            user: req.user?._id,
            title: "New Question Recived",
            message: `You have a new Question in ${courseContent?.title}`
        })

        // save the updated courses
        await course?.save();
        res.status(201).json({success: true, message: 'Question added successfully', course});
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
});


// =================================================================
// =================================================================

// Add Answer in Course Interface
interface IAddAnswerData {
    answer: string;
    questionId: string;
    courseId: string;
    contentId: string;
}

// Add Answer in Course handler 
export const addAnswer = CatchAsyncErrors(async(req: Request, res: Response, next:NextFunction)=> {
    try {
        const {answer, questionId, courseId, contentId } : IAddAnswerData = req.body;
        const course = await Course.findById(courseId);

        if(!mongoose.Types.ObjectId.isValid(contentId)){
            return next(new ErrorHandler('Invalid content id', 400))
        }
        const courseContent = course?.courseData?.find((item:any) => item._id.equals(contentId));
        if(!courseContent){
            return next(new ErrorHandler('Invalid content id', 400))
        }
        
        const question = courseContent?.questions?.find((item:any) => item._id.equals(questionId));
        if(!question){
            return next(new ErrorHandler('Invalid question id', 400))
        }

        // create a new Answer object
        const newAnswer: any = {
            user: req.user,
            answer
        }
        // add this answer to our course content
        question.questionReplies?.push(newAnswer);
        await course?.save();

        if(req.user?._id === question.user.id){
            // create a notification for reply question from admin side
            await Notification.create({
                user: req.user?._id,
                title: "New Question Reply Recived",
                message: `You have a new Question Reply in ${courseContent?.title}`
            })
        }else{
            const data = {
                name: question.user.name,
                title: courseContent.title,
            }
            // send a notification to the user who created the question
            const html = await ejs.renderFile(path.join(__dirname, '../services/email/question-reply.ejs'), data);

            await sendMail({
                email: question.user.email,
                subject: 'New reply to your question',
                template: "question-reply.ejs",
                data,
            }).catch((error:any)=>{
                return next(new ErrorHandler(error.message, 500));
            })
        }
        res.status(201).json({success: true, message: 'Answer added successfully', course})
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
});


// =================================================================
// =================================================================

// add review in our course interface
interface IAddReviewData {
    rating: number;
    review: string;
    userId: string;
}

// add review in our course handler API
export const addReview = CatchAsyncErrors(async(req:Request, res:Response, next:NextFunction) => {
    try {
        const {rating, review} = req.body as IAddReviewData;
        const courseId = req.params.id;
        const userCourseList = req.user?.courses;

        // check if courseId is already exists in userCourseList base on id
        const courseExists = userCourseList?.some((item:any) => item._id.toString() === courseId);
        if(!courseExists){
            return next(new ErrorHandler("You are not eligible to access this course.", 404));
        }
        const course = await Course.findById(courseId);
        
        // add review to our course content
        const reviewData:any = {
            user:req.user,
            rating,
            comment: review,
        } 
        course?.reviews.push(reviewData);

        // calculate a  review and avg rating
        let avg = 0;
        course?.reviews.forEach((rev) => {
            avg += rev.rating;
        });
        if(course){
            course.ratings = avg / course.reviews.length;  // one example: we have 2 reviews one is 5 another one is 4 so math working like this 4+5 = 9, 9 /2 sp rating is 4.5
        }
        await course?.save();

        // send a review notifaction
        const notification = {
            title: 'New Review Added',
            message: `New review added by ${req.user?.name} on ${course?.name}`,
        }

        // create notification



        res.status(201).json({success: true, message: 'Review added successfully', course})
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500));
    }
});


// =================================================================
// =================================================================

// add replay in course review from admin side
interface IAddReviewReplayData {
    comment: string;
    courseId: string,
    reviewId: string,
}

// add replay in course review from admin side
export const addReplyToReview = CatchAsyncErrors(async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const {comment, courseId, reviewId} = req.body as IAddReviewReplayData;

        const course = await Course.findById(courseId);
        if(!course){
            return next(new ErrorHandler('Course not found', 404));
        }

        const review = course?.reviews.find((rev:any) => rev._id === reviewId)
        if(!review){
            return next(new ErrorHandler('Review not found', 404));
        }

        // add replay to review
        const replyData:any = {
            user: req.user,
            comment,
        }

        // if admin not review reply
        if(!review.commentReplies){
            review.commentReplies = [];
        }

        review.commentReplies?.push(replyData);
        await course?.save();
        return res.status(201).json({success: true, message: 'Reply added successfully', course})
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500))
    }
});




// get all courses for only admin
export const getAdminAllCourses = CatchAsyncErrors(async(req:Request, res:Response, next:NextFunction) => {
    try {
      const courses = await Course.find().sort({createdAt: -1});
      res.status(201).json({success: true, courses});
    } catch (error:any) {
      return  next(new ErrorHandler(error.message, 400));
    }
  }); 


// delete course  -- only for admin
export const deleteCourse = CatchAsyncErrors(async(req:Request, res:Response, next:NextFunction) => {
    try {
      const {id} = req.params;
      const course = await Course.findById(id);
      if(!course) {
        return next(new ErrorHandler('Course not found', 404));
      }
      // delete course from redis and mongoose db
      await course.deleteOne({id});
      await redis.del(id);
  
      res.status(200).json({success: true, message: 'Course deleted successfully'});
    } catch (error:any) {
      return next(new ErrorHandler(error.message, 500))
    }
})




// Generate Video Url
export const generateVideoUrl = CatchAsyncErrors(async(req:Request, res:Response, next:NextFunction) => {
    try {
        const { videoId } = req.body;
        
        const response = await axios.post(`https://dev.vdocipher.com/api/videos/${videoId}/otp`, 
        { ttl: 300 },
        {
            headers: {
                Accept: "application/json",
                'Content-Type': "application/json",
                Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET_KEY}`
            },
        });

        res.status(200).json(response.data);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

