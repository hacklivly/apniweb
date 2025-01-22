const express = require('express');
const Chat = require('../models/Chat');
const router = express.Router();

router.get('/:userId', async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.params.userId }).populate('participants', 'username profilePic');
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching chats', error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { sender, receiver, text, image } = req.body;
  try {
    let chat = await Chat.findOne({ participants: { $all: [sender, receiver] } });
    if (!chat) {
      chat = new Chat({ participants: [sender, receiver], messages: [] });
    }
    chat.messages.push({ sender, text, image });
    await chat.save();
    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ message: 'Error sending message', error: err.message });
  }
});

module.exports = router;
