import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
    message: {
      type: String,
      required: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    // For one-to-one chat, store the receiver
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: function() {
        return !this.group; // Only required if it's a one-to-one chat 
      }
    },
    // For group chat, store the group reference
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'groups',
      required: function() {
        return !this.receiver;
      }
    },
    type : {
        type : Boolean, // true means group chat, false means one to one chat
        default :true
    },
    status: {
        type: Number,
        default: 1, 
        required: true
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    }],
    created_at: {
      type: Date,
      default: Date.now
    }
  });

export  const MessageModel = mongoose.model("messages", messageSchema);

  const createGroupMessage = async(message, groupId, sender) => {
    const createMsg =await new MessageModel({
        message : message,
        group : groupId,
        sender : sender
    }).save();
    const msgFormat = await MessageModel.findById({_id : createMsg._id}).populate('sender', 'username').populate('group', 'name').populate('likes', 'username');
    return msgFormat;
  }
 
  const likeGroupMessage = async (msgId, userId) => {
    try {
        // Use $addToSet to avoid duplicate likes from the same user
        const likeMsg = await MessageModel.findByIdAndUpdate(
            { _id: msgId },
            { $addToSet: { likes: userId } }, 
            { new: true } 
        );
        return likeMsg;
    } catch (error) {
        console.error("Error liking message:", error);
        return false;
    }
};

  const getGroupIdByMsg = async (_id) =>{
        return await MessageModel.findById(_id, 'group');
    }

  const getAllGroupMessages = async(groupId) => {
    const groupMessages = await MessageModel.find({ group: groupId }).populate('sender', 'username').populate('group', 'name').populate('likes', 'username');
    return groupMessages;
  }
  
  const getAllOneToOneMessages = async(userId1, userId2) => {
    const oneToOneMessages = await MessageModel.find({
        $or: [
          { sender: userId1, receiver: userId2 },
          { sender: userId2, receiver: userId1 }
        ]
      }).populate('sender', 'username').populate('receiver', 'username');
    return oneToOneMessages;
    }

  
  export {getGroupIdByMsg, getAllGroupMessages, getAllOneToOneMessages, createGroupMessage, likeGroupMessage};

  