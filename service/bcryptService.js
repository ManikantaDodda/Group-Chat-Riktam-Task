import bcrypt from 'bcryptjs';
import UserModel from "../model/userModel.js";
import jwt from 'jsonwebtoken';

const generateRandomId = async(role) => {
    try {
    let newid = Math.floor(Math.random() * 900000000000) + 100000000000;
    newid = role === "admin" ? 'A-' + newid : role === "user" ? 'U-' + newid : 'T-' + newid;
    let isExists = await UserModel.findbyUniqueNumber(newid);
    if(isExists){
        return generateRandomId(role);
    }
    return newid;
    } 
    catch(error) {
        res.status(400).send({ status: "error", message: "Server error please try again."+error });
    }

  };

export const encryptThePassword = async(password) =>{
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    return hash;
}

const Registration = async (req, res) => {
    try{

    const { username, mobile, password, role } = req.body;
    const added_by = req.user?.mobile;
    let hashPassword = await encryptThePassword(password);
    let newid = await generateRandomId(role);
  
    const userData = {
        username,
        mobile,
        role,
        uniqueId: newid,
        password: hashPassword
    };

    const response = await UserModel.Registration({...userData, added_by});
    if (response) {
        return res.send({
            status: "success",
            message: "Record added successfully.",
            data : response
        });
    } else {
        res.status(400).send({ status: "error", message: "Server error please try again." });
    }
    }
    catch(error)
    {
        res.status(500).send({ status: "error", message: "Server error please try again..."+error });
    }
}

const Login = async (req, res, response) => {
    const matchPass = bcrypt.compareSync(req.body.password, response.password);
    if (matchPass === true) {
        const token = jwt.sign({
            _id: response._id,
            mobile: response.mobile,
            role: response.role,
            username : response.username
        },
            `${process.env.JWT_PRIVATE_KEY}`, {
            expiresIn: "12h"
        });
        return res.send({
            status: "success",
            message: "Login successfully.",
            token: token
        });
    } else {
        res.status(400).send({ status: "error", message: "Password Incorrect." });
    }
}
// Authenticate Token Middleware
const authenticateToken = async (req, res, role) => {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
            const authenticatedUser = await UserModel.findByUserId(decoded._id);

            if (authenticatedUser && (authenticatedUser.role === role || role===true)) {
                req.user = authenticatedUser; 
                return 1; // Success
            } else {
                return 2; // Unauthorized Role
            }
        } catch (error) {
            return error; // Token verification or other error
        }
    } else {
        return 3; // Missing token
    }
};

const isAuthenticated = (role) => {
    return async (req, res, next) => {
        const authenticatedStatus = await authenticateToken(req, res, role);

        if (authenticatedStatus === 1) {
            next(); // Proceed to the next middleware or route handler
        } else if (authenticatedStatus === 2) {
            return res.status(401).send({ status: "error", message: "Unauthorized User." });
        } else if (authenticatedStatus === 3) {
            return res.status(401).send({ status: "error", message: "Authorization token is missing." });
        } else {
            console.error("Authentication Error: ", authenticatedStatus); // Log unexpected error
            return res.status(500).send({ status: "error", message: "Unexpected error occurred It may Token Incorrect  or Expired." });
        }
    };
};

// Admin Middleware
const isAuthenticatedAdmin = isAuthenticated('admin');

// User Middleware
const isAuthenticatedUser = isAuthenticated('user');

// Both Login Middleware
const isLoginAuthenticated = isAuthenticated(true);


const resetPassword = async (req, res) => {
    const { username, mobile, password } = req.body;
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    const newData = {
        username, mobile, password: hash
    };
    const response = await UserModel.resetPassword(newData);
    if (response) {
        return res.send({ status: "success", message: "Password updated successfully." });
    } else {
        res.status(400).send({ status: "error", message: "Password not updated." })
    }
}

export default {
    generateRandomId, Registration, Login, resetPassword, isAuthenticatedAdmin, isAuthenticatedUser, isLoginAuthenticated
}