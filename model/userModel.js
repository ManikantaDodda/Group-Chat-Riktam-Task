import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    unique: true,
    maximum: 10,
    required: true,
  },
  uniqueId: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 3,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  added_by: {
    type: Number,
    maximum: 10,
    required: false,
  },
  status: {
    type: Number,
    default: 1,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    required: false
  }
});

const Registration = async (data) => {
  const addUser = mongoose.model("users", UserSchema);
  let saveUser = new addUser({
    username: data.username,
    mobile: data.mobile,
    password: data.password,
    role: data.role,
    uniqueId: data.uniqueId,
    added_by: data.added_by
  });
  const reponse = await saveUser.save();
  return reponse;
};

const updateUser = async(_id, updatedata) => {
  const addUser = mongoose.model("users", UserSchema);
  console.log(updatedata);
  const uptUser = await addUser.findByIdAndUpdate(
    { _id: _id },  
    { $set: updatedata },
    { new: true }
  );
  return uptUser;
}

const findByUserId = async(_id) => {
  const user = mongoose.model("users", UserSchema);
  return await user.findById(_id); 
}

const findbyMobileNumber = async (number) => {
  const user = mongoose.model("users", UserSchema);
  let result = await user.findOne({ mobile: number });
  return result;
};
const findbyUniqueNumber = async (id) => {
  const user = mongoose.model("users", UserSchema);
  let result = await user.findOne({ uniqueId: id });
  console.log(result);
  return result;
};

const login = async (data) => {
  let mobile = data.mobile
  let password = data.password;
  const loginUser = mongoose.model("users", UserSchema);
  let result = loginUser.findOne({ mobile: mobile, password: password });
  return result;
}

export const UsersModel = mongoose.model("users", UserSchema);

export default { findByUserId,findbyMobileNumber,findbyUniqueNumber, login, Registration, updateUser };