const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const isCustomer = req.user.role === 'CUSTOMER';
    
    const query = isCustomer ? { customerId: userId } : { providerId: userId };
    const populateField = isCustomer ? 'providerId' : 'customerId';
    
    const conversations = await Conversation.find(query)
      .populate(populateField, 'name profileImage')
      .sort('-lastMessageAt');
      
    res.json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.id }).sort('createdAt');
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    let conversation = await Conversation.findById(req.params.id);
    if (!conversation) return res.status(404).json({ success: false, message: 'Conversation not found' });
    
    const message = new Message({
      conversationId: req.params.id,
      senderId: req.user._id,
      content: req.body.content
    });
    
    await message.save();
    
    conversation.lastMessage = req.body.content;
    conversation.lastMessageAt = Date.now();
    await conversation.save();
    
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
