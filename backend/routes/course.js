
const { Router } = require('express');
const courseRoute = Router();
const { usermiddleware } = require('../middleware/usermiddleware');
const { purchaseModel, courseModel, userModel } = require('../db');






courseRoute.post('/purchase', usermiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const { courseId, paymentMethod, amount } = req.body;
        const course = await courseModel.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const PaymentResponse = await mockPayment(course.price);
        const purchase = await purchaseModel.create({
            userId: userId,
            courseId: courseId,
            transactionId: transactionId,
            amount: amount,
            paymentMethod: paymentMethod,
            status: "Completed"
        });

        if (purchase) {
            res.status(200).json({
                message: "You have purchased the course successfully",
                purchase,
                _id: purchase._id
            });
        } else {
            res.status(404).json({
                message: "An error occurred"
            });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal server error" });
    }
});



    courseRoute.get('/getcourse', usermiddleware, async (req, res) => {
        try {


            if (courses) {
                res.status(200).json({
                    message: 'These are your courses',
                    courses,

                });
            }
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Internal server error" });
        }
    });



module.exports = {
    initCourseRoute,
    courseRoute,
};
