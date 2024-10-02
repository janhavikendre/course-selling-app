const { Router } = require('express');
const courseRoute = Router();
const { usermiddleware } = require('../middleware/usermiddleware');
const { purchaseModel, courseModel } = require('../db');


courseRoute.post('/purchase', usermiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const { courseId, transactionId, paymentMethod, amount } = req.body;
        
        const course = await courseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

 
        const purchase = await purchaseModel.create({
            userId: userId,
            courseId: courseId,
            transactionId: transactionId,
            amount: amount,
            paymentMethod: paymentMethod,
            status: "Completed"
        });

       
        res.status(200).json({
            message: "You have successfully purchased the course",
            purchase,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal server error" });
    }
});


courseRoute.get('/getcourse', usermiddleware, async (req, res) => {
    try {
        const courses = await courseModel.find();

        if (courses) {
            res.status(200).json({
                message: 'These are the available courses',
                courses,
            });
        } else {
            res.status(404).json({
                message: 'No courses found',
            });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = {
    courseRoute,
};
