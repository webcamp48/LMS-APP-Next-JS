import express from 'express';
import { isAutheticated, isAuthorizedRole } from '../middleware/auth';
import { addAnswer, addQuestion, addReplyToReview, addReview, getAllCourse,getSingleCourse, getAdminAllCourses, getCourseByUserId, updateCourse, uploadsCourse, deleteCourse, generateVideoUrl } from '../controllers/courseController';
import { updateAccessToken } from './../controllers/userController';
const courseRouter = express.Router();

courseRouter.post("/createCourse", updateAccessToken, isAutheticated, isAuthorizedRole("Admin"), uploadsCourse); 
courseRouter.put("/updateCourse/:id",updateAccessToken, isAutheticated, isAuthorizedRole("Admin"), updateCourse);
courseRouter.get("/getSingleCourse/:id", getSingleCourse);
courseRouter.get("/getAllCourse", getAllCourse);
courseRouter.get("/getCourseById/:id",updateAccessToken, isAutheticated, getCourseByUserId);

courseRouter.put("/addQuestion", updateAccessToken, isAutheticated, addQuestion);
courseRouter.put("/addAnswer", updateAccessToken, isAutheticated, addAnswer);
courseRouter.put("/addReview/:id", updateAccessToken, isAutheticated, addReview);
courseRouter.put("/addReply", updateAccessToken, isAutheticated,isAuthorizedRole("Admin"), addReplyToReview);

// for admin
courseRouter.get("/getAdminAllCourses", updateAccessToken, isAutheticated,isAuthorizedRole("Admin"), getAdminAllCourses);
courseRouter.post("/getVdoCipherOTP", generateVideoUrl)
courseRouter.delete("/deleteCourse/:id", updateAccessToken, isAutheticated, isAuthorizedRole("Admin"), deleteCourse);




export default courseRouter;

