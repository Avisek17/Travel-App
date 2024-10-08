



 const { postUserModel,getUserModel } = require('../models/users.model');
 
 const bcrypt = require('bcryptjs');

const postUser = async (req, res) => {
    const userInfo = req.body;
    try {
        if (!userInfo.username || !userInfo.email || !userInfo.password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const hashedPassword = await bcrypt.hash(userInfo.password, 10);
        userInfo.password = hashedPassword;

        const result = await postUserModel(userInfo);
        res.status(201).json({ message: "User added successfully", data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding user", error });
    }
};
// Login a user
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const users = await getUserModel();
        const user = users.find(user => user.user_name === username);

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const match = await bcrypt.compare(password, user.user_password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Store user information in session
        req.session.user = {
            id: user.user_id,
            username: user.user_name
        };

        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error logging in' });
    }
};

const logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Error logging out' });
        }
        res.status(200).json({ message: 'Logout successful' });
    });
};


module.exports = { postUser, loginUser, logoutUser };


