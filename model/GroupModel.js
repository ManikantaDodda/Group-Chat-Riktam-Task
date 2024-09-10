import mongoose from "mongoose";
import {UsersModel} from "./userModel.js";
const GroupSchema = new mongoose.Schema({
    group_name: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: "users"
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }], 
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
        default: null 
    }
});

const GroupModel = mongoose.model("groups", GroupSchema);

const getGroupById = async(_id, user_id) => {
    const group = await GroupModel.findOne({_id, user_id});
    return group;
}

const getAllGroupsByUserId = async(user_id) => {
    const groups = await GroupModel.find({members : {$in: user_id}});
    return groups;
}

// Function to get a group by ID with user_id and members populated
const getGroupDetailsById = async (_id) => {
    const group = await GroupModel.findById(_id)
        .populate('user_id', 'username') 
        .populate('members', 'username mobile');
    return group;
};

// Function to create a new group
const createNewGroup = async (groupName, userId) => {
    const newGroup = new GroupModel({
        group_name: groupName,
        user_id: userId,
        members: [userId]
    });

    await newGroup.save();
    return newGroup;
};

const addMemberIntoGroup = async (groupId, members = []) => {
        const group = await GroupModel.findById(groupId);
        if (!group) {
            return false;
        }
        try {
        const newMembers = members.filter(member => !group.members.includes(member));
        if (newMembers.length > 0) {
            group.members.push(...newMembers);
            return await group.save();
        } else {
            return false;
        }
    } catch(err) { console.log(err);}
};

const removeMemberFromGroup = async (groupId, members = []) => {
  
    try {
        const groupm = await GroupModel.findById(groupId, "members");
        if (!groupm) {
            return false;
        }
        const validMembers = members.filter(member => groupm.members.includes(member));
        console.log("members-----",  validMembers);
        if(validMembers.length)
        {
        const group = await GroupModel.findByIdAndUpdate(
            {_id : groupId},  
            { $pull: { members: { $in: validMembers } } },  // Use $pull to remove members, $in to match members in the array
            { new: true }  // Return the updated document
          );
            return group; 
        }
        else {
            return false;
        }
  } catch(err) { console.log(err);}
};

const deleteGroup = async(_id) => {
    return await GroupModel.findByIdAndDelete(_id);
}

const updateGroupName = async(_id, group_name) => {
    return await GroupModel.findByIdAndUpdate(_id, {group_name},{ new: true } );
}

const nonExistingGroupMembers = async (groupId) => {
    const group = await GroupModel.findById(groupId, "members");
    
    if (!group || !group.members) {
        return [];
    }
    const users = await UsersModel.find({
        _id: { $nin: group.members }
    }, 'username mobile');

    return users;
}

const isValidGroupMember = async (_id, memberId) => {
    try {
        const group = await GroupModel.findById(_id);
        if (group) {
            let groupMembers = group.members.map(member => member.toString());
            let isExist = groupMembers.includes(memberId.toString());
            return isExist ? isExist : "Member Id is Not valid";
        } else {
            return "Group is Not Valid";
        }
    } catch (error) {
        console.error("Error checking if valid group member:", error);
        return error;
    }
};

export {getGroupDetailsById, getGroupById,getAllGroupsByUserId, createNewGroup, addMemberIntoGroup, isValidGroupMember, deleteGroup,removeMemberFromGroup, updateGroupName , nonExistingGroupMembers};

