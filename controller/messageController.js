import {createGroupMessage, likeGroupMessage, getGroupIdByMsg, getAllGroupMessages } from "../model/MessageModel.js";
import { isValidGroupMember } from "../model/GroupModel.js";
const sendGroupMessage = async(req,res) => 
{
    try{
        let message = req.body.message;
        let groupId = req.body.groupId;
        let sender = req.user._id;
        if(!groupId && !message)
        {
            res.status(400).send({ status: "error", message: "Please Provide valid data." });
            return;
        }
        const isValidMember = await isValidGroupMember(groupId, sender);
        if(isValidMember === true)
        {
        const sentmsg = await createGroupMessage(message, groupId, sender);
        res.send({status : "success", message : "Message sent", data:sentmsg});
        }
        else {
            res.status(400).send({status : "error", message : isValidMember});  
        }
    } catch(err) {
        res.status(400).send({status : "error", message : "Something went Wrong"});  
        console.log(err);
    }
}

const likeGroupMessageByUser = async(req,res) => 
{
    try{
        let msgId = req.body.messageId;
        let user_id = req.user._id;
        if(!msgId)
        {
            res.status(400).send({ status: "error", message: "Please Provide valid data." });
            return;
        }
        const getGroupId = await getGroupIdByMsg(msgId);
        if(getGroupId)
        {
            let groupId = getGroupId.group;
            const isValidMember = await isValidGroupMember(groupId, user_id);
            if(isValidMember === true)
            {
                const likeMsg = await likeGroupMessage(msgId, user_id);
                res.send({status : "success" ,message : "Liked Successfully", data : likeMsg});
            }
            else {
                res.status(400).send({status : "error", message : isValidMember});   
            }
       }
       else {
             res.status(400).send({status : "error", message : "Data Is Not Valid"});  
       }
    } catch(err) {
        console.log(err);
    }
}

const getAllMessagesByGroupId = async(req,res) =>{
    try{
        let grpId = req.params.gid;
        let user_id = req.user._id;
        if(!grpId)
        {
            res.status(400).send({ status: "error", message: "Please Provide valid data." });
            return;
        }
            let groupId = grpId;
            const isValidMember = await isValidGroupMember(groupId, user_id);
            if(isValidMember === true)
            {
                const groupMsg = await getAllGroupMessages(groupId);
                res.send({status : "success" ,message : "Fetched Successfully", data : groupMsg});
            }
            else {
                res.status(400).send({status : "error", message : isValidMember});   
            }
    } catch(err) {
        console.log(err);
    }
}

export {sendGroupMessage, likeGroupMessageByUser, getAllMessagesByGroupId};