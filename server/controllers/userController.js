// import required dependencies
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/user';
// import Token from '../middleware/token';

// export function createUser(req, res) {
//     bcrypt.hash(req.body.password, 15, (err, hash) => {
//         const password = hash;
//         const user = new User({
//             _id: new mongoose.Types.ObjectId(),
//             username: req.body.username,
//             email: req.body.email,
//             password,
//         });
//         // check that user submits the required value
//         if (!user.username || !user.email || !user.password) {
//             return res.status(400).json({
//                 message: 'Please ensure you fill the username, email, and password',
//             });
//         }
//         // verify the user isn't stored in the database
//         return User.count({
//                 $or: [{
//                         username: req.body.username
//                     },
//                     {
//                         email: req.body.email
//                     },
//                 ],
//             })
//             .then((count) => {
//                 if (count > 0) {
//                     return res.status(401).json({
//                         message: 'This user exists',
//                     });
//                 }
//                 // if user doesn't exist, create one
//                 return user
//                     .save()
//                     .then((newUser) => {
//                         const token = Token(newUser);
//                         res.status(201).json({
//                             message: 'User signup successfully',
//                             newUser: {
//                                 username: newUser.username,
//                                 email: newUser.email,
//                             },
//                             token,
//                         });
//                     })
//                     .catch(() => {
//                         res.status(500).json({
//                             message: 'Our server is in the locker room, please do try again.'
//                         });
//                     });
//             });
//     });
// }

// export function loginUser(req, res) {
//     const {
//         username,
//         password
//     } = req.body;
//     User.findOne({
//             username
//         })
//         .then((existingUser) => {
//             bcrypt.compare(password, existingUser.password, (err, result) => {
//                 if (err) {
//                     return res.status(401).json({
//                         message: 'Not authorized',
//                     });
//                 }
//                 if (result) {
//                     const token = Token(existingUser);
//                     return res.status(200).json({
//                         message: 'User authorization successful',
//                         existingUser: {
//                             username: existingUser.username,
//                             email: existingUser.email,
//                             _id: existingUser.id,
//                         },
//                         token,
//                     });
//                 }
//                 return res.status(401).json({
//                     message: 'Invalid details',
//                 });
//             });
//         })
//         .catch(() => res.status(500).json({
//             message: 'Our server is in the locker room, please do try again.'
//         }));
// }

// Get all users
export function getAllUsers(req, res) {
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
}

// get user
export function getUser(req, res) {
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




export default User;