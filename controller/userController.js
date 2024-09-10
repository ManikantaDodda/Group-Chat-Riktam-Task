import UserModel from '../model/userModel.js';
import BcryptService from '../service/bcryptService.js'
import { encryptThePassword } from '../service/bcryptService.js';

const login = async (req, res) => {
    try {
        const mobile = req.body.mobile;
        const password = req.body.password;
        if(!mobile && !password)
        {
            res.status(400).send({ status: "error", message: "Please provide mobile and password." });
            return; 
        }
        const IsUserExist = await UserModel.findbyMobileNumber(mobile);
        if (IsUserExist) {
            return await BcryptService.Login(req, res, IsUserExist);
        } else {
            res.status(400).send({ status: "error", message: "User not Exist." })
        }
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
}

const registration = async (req, res) => {
    try {
        const {username, mobile, role, password} = req.body;
        if(!username && !mobile && !role && !password)
        {
            res.status(400).send({ status: "error", message: "Please Provide Valid Data." });
            return
        }
        const IsUserExist = await UserModel.findbyMobileNumber(mobile);
        if (!IsUserExist) {
            if (String(mobile).length === 10) {
                return await BcryptService.Registration(req, res);
            } else {
                res.status(400).send({ status: "error", message: "Contact number must be 10 digits." });
            }
        } else {
            res.status(400).send({ status: "error", message: "Allready exist." });
        }
    } catch (error) {
        res.status(400).send({ status: "error", message: error.message });
    }
}
const updateExistingUser = async (req, res) => {
    try {
        let updatedata = {};
        let user_id = req.body.user_id;
        let username = req.body.username;
        let role = req.body.role;
        let password = req.body.password;
        let mobile = req.body.mobile;
        if (username) updatedata.username = username;
        if (role) updatedata.role = role;
        if (password) 
        {
            let hashPassword = await encryptThePassword(password);
            updatedata.password = hashPassword;
        }
        if (mobile && String(req.body.mobile).length === 10)
        {
            const IsUserExist = await UserModel.findbyMobileNumber(mobile);
            if(!IsUserExist)
            {
                updatedata.mobile = mobile;
            }
            else {
                return  res.status(401).send({ status: "error", message: "Mobile No Already exist." });
            }
        }
        if(Object.keys(updatedata).length && user_id)
        {
            const isUser = await UserModel.findByUserId(user_id);
            if(isUser)
            {
                const editUser = await UserModel.updateUser(user_id, updatedata);
                if(editUser)
                {
                    return  res.send({ status: "success", message: "Successfully Updated!" });
                }
                else {
                    return  res.status(500).send({ status: "error", message: "Something Went Wrong!" });
                }
            }
            else {
                return  res.status(404).send({ status: "error", message: "User Not Found." });
            }
        }
        else {
            return  res.status(400).send({ status: "error", message: "Give me Proper data ." });
        }
        
    } catch (error) {
        res.status(400).send({ status: "error", message: error.message });
    }
}

export default {
    registration, login, updateExistingUser
}