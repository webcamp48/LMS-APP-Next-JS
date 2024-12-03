import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";

import cloudinary from 'cloudinary'
import Layout from "../models/layoutModel";


// createLayout handler
export const createLayout = CatchAsyncErrors(async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {type} = req.body;
    

        const isTypeExists = await Layout.findOne({type});
        if(isTypeExists) {
           return next(new ErrorHandler(`${type } type already exists.`, 400 ))
        }
        if(type === 'Banner') {
            const {image, title, subTitle} = req.body ;
            if (!image || !title || !subTitle) {
                return next(new ErrorHandler("Banner fields are missing.", 400));
            }
            const myCloud = await cloudinary.v2.uploader.upload(image, {
                folder: 'layout'
            })
            const banner = {
                type: "Banner",
                banner: {
                    image: {
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url,
                    },
                    title,
                    subTitle,
                },
            };

            await Layout.create({type : "Banner", banner});
        }

        if(type === 'FAQ'){
            const {faq} = req.body;
            const faqItems = await Promise.all(
                faq.map(async (item: any) => {
                    return {
                        question: item.question,
                        answer: item.answer,
                    }
                })
            )
           await Layout.create({type:"FAQ", faq:faqItems})
        }
        if(type === 'Categories') {
            const {categories} = req.body;
            const categoriesItem = await Promise.all(
                categories.map(async (item: any) => {
                    return {
                        title: item.title,
                    }
                })
            )
           await Layout.create({type:"Categories", categories:categoriesItem})
        }
        res.status(201).json({success: true, message: 'Layout Created Successfully.'});
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500));
    }
});



// editLayout handler
export const editLayout = CatchAsyncErrors(async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {type} = req.body;
        console.log("data", req.body);

        if(type === 'Banner') {
            const {image, title, subTitle} = req.body ;
            const bannerData : any = await Layout.findOne({type: 'Banner'});

            const data = image.startsWith("https") ? bannerData : await cloudinary.v2.uploader.upload(image, {
                folder: 'layout',
            })

            const banner = {
                type : "Banner",
                image : {
                    public_id : image.startsWith("https")
                    ? bannerData.banner.image.public_id
                    : data?.public_id,
                    url : image.startsWith("https")
                    ? bannerData.banner.image.url
                    : data?.secure_url,
                },
                title,
                subTitle
            }

            await Layout.findByIdAndUpdate(bannerData?.id, {type : "Banner",banner});
        }

        if(type === 'FAQ'){
            const {faq} = req.body;
            const faqItem = await Layout.findOne({type:"FAQ"});
            const faqItems = await Promise.all(
                faq.map(async (item: any) => {
                    return {
                        question: item.question,
                        answer: item.answer,
                    }
                })
            )
           await Layout.findByIdAndUpdate(faqItem?._id, {type:"FAQ", faq:faqItems})
        }
        if(type === 'Categories') {
            const {categories} = req.body;
            const categoriesItem = await Layout.findOne({type: "Categories"})
            const categoriesItems = await Promise.all(
                categories.map(async (item: any) => {
                    return {
                        title: item.title,
                    }
                })
            )
           await Layout.findByIdAndUpdate(categoriesItem?._id, {type:"Categories", categories:categoriesItems})
        }
        res.status(201).json({success: true, message: 'Layout Updated Successfully.'});
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500));
    }
});


// get layout by Type
export const getLayoutByType = CatchAsyncErrors(async(req:Request, res:Response, next:NextFunction) => {
    try {
        const {type} = req.params;
        const layout = await Layout.findOne({type});
        // if(!layout) {
        //     return next(new ErrorHandler(`${type} type not Found.`, 500));
        // }
        res.status(200).json({success: true, layout});
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500))
    }
})