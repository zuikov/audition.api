const User = require('../models/user');

class UserController {
    // Get all users
    static getAllUsers(req, res) {
        User.find()
            .select('_id username email')
            .then((allUsers) => {
                return res.status(200).json({
                    success: true,
                    message: 'A list of all Users',
                    Userlist: allUsers,
                });
            })
            .catch((err) => {
                res.status(500).json({
                    success: false,
                    message: 'Server error. Please try again.',
                    error: err.message,
                });
            });
    };

    // get user
    static getUser(req, res) {
        const id = req.params.listObjectId;
        Use.findById(id)
            .then((user) => {
                res.status(200).json({
                    success: true,
                    message: `user id: ${user.id}`,
                    User: user,
                });
            })
            .catch((err) => {
                res.status(500).json({
                    success: false,
                    message: 'This user does not exist',
                    error: err.message,
                });
            });
    }
}


module.exports = UserController;