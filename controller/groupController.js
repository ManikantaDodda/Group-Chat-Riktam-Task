import { createNewGroup,updateGroupName, getGroupById,getAllGroupsByUserId,searchGroupsByName, getGroupDetailsById ,
 addMemberIntoGroup, isValidGroupMember, deleteGroup, removeMemberFromGroup, nonExistingGroupMembers} from "../model/GroupModel.js"

const createNewGroupController = async(req, res) =>{
    try{
       let groupName = req.body.groupName;
       if(!groupName)
       {
        res.status(400).send({ status: "error", message: "Please Provide valid data." });
        return;
       }
       let user_id = req.user._id;
       const newGroup = await createNewGroup(groupName, user_id);
       if(newGroup) {
        res.send({status :"success", message : "Group created successfully.", data : newGroup });
       }
    } catch (error){

    }
}
const getCreatedGroupController = async(req, res) => {
    try{
        let user_id = req.user._id;
        let groupId = req.params.gid;
        if(!groupId)
        {
            res.status(400).send({ status: "error", message: "Please Provide valid data." });
            return;
        }
        const isValidMember = await isValidGroupMember(groupId, user_id);
        if(isValidMember === true)
        {
        let groupData = await getGroupDetailsById(groupId);
        if(groupData) {
            res.send({status : "success", message : "fetched", data : groupData });
        }  else{
            res.status(400).send({status : "error", message : "Data Not Found"});
        }
        }
        else {
            res.status(400).send({status:"error", message : isValidMember });
        }
    } catch(error){
        console.log(error);
    }
}
const getAllCreatedGroupController = async(req, res) => {
    try{
        let user_id = req.user._id;
        let group_name = req.params.group_name;
        if(!user_id)
        {
            res.status(400).send({ status: "error", message: "Please Provide valid data." });
            return;
        }
        let groupData = [];
        if(group_name && group_name !=null && group_name !=undefined && group_name !='')
        {
            groupData = await searchGroupsByName(user_id, group_name);
        }
        else {
            groupData = await getAllGroupsByUserId(user_id);
        }
         
        if(groupData.length) {
            res.send({status : "success", message : "fetched", data : groupData });
        }  else{
            res.status(400).send({status : "error", message : "Data Not Found"});
        }
       
    } catch(error){
        console.log(error);
    }
}

const upadateGroupNameController = async(req, res) => {
    try{
        let user_id = req.user._id;
        let groupId = req.body.groupId;
        let group_name = req.body.groupName;
        if(!groupId && !group_name)
            {
                res.status(400).send({ status: "error", message: "Please Provide valid data." });
                return;
            }
        const isValidMember = await isValidGroupMember(groupId, user_id);
        if(isValidMember === true)
        {
        let groupData = await updateGroupName(groupId, group_name);
        if(groupData) {
            res.send({status : "success",message : "Group Name has been changed", data : groupData });
        }  else{
            res.status(400).send({status : "error" ,message : "Something went wrong."});
        }
        }
        else {
            res.status(400).send({status: "error", message : isValidMember });
        }
    } catch(error){
        console.log(error);
    }
}

const addMemberIntoGroupController = async(req, res) => {
    try {
        let groupId = req.body.groupId;
        let members = req.body.members;
        if(!groupId && !members.length)
        {
           res.status(400).send({ status: "error", message: "Please Provide valid data." });
           return;
        }
        let user_id = req.user._id;
        console.log(req.body);
        const isExistGroup = await getGroupById(groupId, user_id);
        if(isExistGroup)
        {
            const addMember = await addMemberIntoGroup(groupId, members);
            if(addMember)
            {
                res.status(200).send({status:"success",message : "Succefully Added", data : addMember }); 
            }
            else {
                res.status(400).send({status:"error",message : "Member Already Exists Group!" });  
            }
        }
        else {
            res.status(404).send({status:"error", message : "It may Group Or User Invalid Group Admin can Only add New Members" });
        }
       
    } catch(error)
    {
console.log(error);
    }
}
const removeMemberIntoGroupController = async(req, res) => {
    try {
        let groupId = req.body.groupId;
        let members = req.body.members;
        let user_id = req.user._id;
        if(!groupId && !members.length)
        {
            res.status(400).send({ status: "error", message: "Please Provide valid data." });
            return;
        }
        const isExistGroup = await getGroupById(groupId, user_id);
        if(isExistGroup)
        {
            const removeMember = await removeMemberFromGroup(groupId, members);
            if(removeMember)
            {
                res.send({status : "success", message : "Succefully removed", data : removeMember }); 
            }
            else {
                res.status(400).send({status : "error", message : "Something Went Wrong!" });  
            }
        }
        else {
            res.status(404).send({status : "error", message : "It may Group Or User Invalid Group Admin can Only remove Members" });
        }
       
    } catch(error)
    {
console.log(error);
    }
}


const deleteGroupController = async(req, res) => {
    try {
        let groupId = req.params.gid;
        let user_id = req.user._id;
        if(!groupId)
        {
            res.status(400).send({ status: "error", message: "Please Provide valid data." });
            return;
        }
        const isExistGroup = await getGroupById(groupId, user_id);
        if(isExistGroup)
        {
            const deleteGrp = await deleteGroup(groupId);
            if(deleteGrp)
            {
                res.status(200).send({status:"success", message : "Succefully deleted", data : deleteGrp }); 
            }
            else {
                res.status(400).send({status:"error", message : "Something Went Wrong!" });  
            }
        }
        else {
            res.status(404).send({status:"error" ,message : "It may Group Or User Invalid Group Admin can Only delete" });
        }
       
    } catch(error)
    {
console.log(error);
    }
}

const getNonExistingUsersIntoGroupController = async(req, res) => {
    try{
        let user_id = req.user._id;
        let groupId = req.params.gid;
        if(!user_id && groupId)
        {
            res.status(400).send({ status: "error", message: "Please Provide valid data." });
            return;
        }
        const isValidMember = await isValidGroupMember(groupId, user_id);
        if(isValidMember === true)
        {
        let userData = await nonExistingGroupMembers(groupId);
        if(userData) {
            res.send({status : "success",message : "Data Fetched", data : userData });
        }  else{
            res.status(400).send({status : "error" ,message : "Something went wrong."});
        }
        }
        else {
            res.status(400).send({status :"error" ,message : isValidMember });
        }
       
    } catch(error){
        console.log(error);
    }
}


export { createNewGroupController, getCreatedGroupController, getAllCreatedGroupController, addMemberIntoGroupController, deleteGroupController,removeMemberIntoGroupController, upadateGroupNameController, getNonExistingUsersIntoGroupController};