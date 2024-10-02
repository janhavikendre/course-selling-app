const { Router } = require('express');
const admincourse = Router();
const { app } = require('../middleware/adminmiddleware');
const { courseModel } = require('../db');
const { z } = require('zod');


admincourse.post('/create', app, async function (req, res) {
    try {
        const requiredbody = z.object({
            title: z.string(),
            description: z.string(),
            imageUrl: z.string(),
            price: z.string(),
            category: z.string(),
            difficulty: z.string(),
        });

        const parsedbody = requiredbody.safeParse(req.body);
        if (!parsedbody.success) {
            res.status(404).json({
                message: "You have entered something wrong",
                error: parsedbody.error,
            });
            return;
        }

        const adminId = req.userId;
        const { title, description, imageUrl, price, category, difficulty } = req.body;

     
        const courses = await courseModel.create({
            title,
            description,
            imageUrl,
            price,
            creatorId: adminId,
            category,
            difficulty,
        });

        res.status(200).json({
            message: "Course created successfully",
            courses,
            id: courses._id,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal server error" });
    }
});

admincourse.put('/update', app, async function (req, res) {
    try {
        const adminId = req.userId;
        const { title, description, imageUrl, price, courseId, category, difficulty } = req.body;

     
        const courses = await courseModel.updateOne(
            { _id: courseId, creatorId: adminId },
            { title, description, imageUrl, price, category, difficulty },
            { new: true }
        );

        res.status(200).json({
            message: "Course updated successfully",
            courses,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal server error" });
    }
});


admincourse.get('/get', app, async function (req, res) {
    try {
        const adminId = req.userId;

        const courses = await courseModel.find({ creatorId: adminId });
        if (courses.length > 0) {
            res.status(200).json({
                message: "Here are your courses",
                courses,
            });
        } else {
            res.status(404).json({ message: "No courses found" });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal server error" });
    }
});


admincourse.delete('/delete', app, async function (req, res) {
    try {
        const adminId = req.userId;
        const courseId = req.body.courseId;

        // Delete the course based on courseId and creatorId
        const courseDeletion = await courseModel.deleteOne({ _id: courseId, creatorId: adminId });

        if (courseDeletion.deletedCount > 0) {
            res.status(200).json({
                message: "Course deleted successfully",
                courseId,
            });
        } else {
            res.status(400).json({
                message: "Course not found or you don't have permission",
            });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = {
    admincourse,
};
