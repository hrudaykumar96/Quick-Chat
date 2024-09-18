const express = require('express');
const router = express.Router();
const verify_token  = require('../authentication/verifytoken');
const Participants = require('../models/Participants');
const mongoose = require('mongoose');
const Messages = require('../models/Messages');  


/* participants list */
router.get('/participants/data', verify_token, async (req, res) => {
  try {
      const user = req.user;
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

      // Fetch participants based on sender or receiver
      const participants = await Participants.find({
          $or: [
              { sender: user._id },
              { receiver: user._id }
          ]
      }).sort({ updatedAt: -1 })
        .populate('sender')
        .populate('receiver')
        .exec();


      if (participants.length === 0) {
          return res.json({ success: [] });
      }


      const uniqueParticipants = [];
      const participantSet = new Set();

      participants.forEach(chat => {
          const sender = chat.sender._id.toString() !== user._id.toString() ? chat.sender : null;
          const receiver = chat.receiver._id.toString() !== user._id.toString() ? chat.receiver : null;

          if (sender && !participantSet.has(sender._id.toString())) {
              uniqueParticipants.push({
                  participantId: chat._id,
                  ...sender.toObject(),
                  id: sender._id
              });
              participantSet.add(sender._id.toString());
          }

          if (receiver && !participantSet.has(receiver._id.toString())) {
              uniqueParticipants.push({
                  participantId: chat._id, 
                  ...receiver.toObject(),
                  id: receiver._id
              });
              participantSet.add(receiver._id.toString());
          }
      });

      res.json({ success: uniqueParticipants });

  } catch (err) {
      res.status(500).send('Error fetching participants');
  }
});




/* clear chat */

router.delete('/delete/participants/:id', verify_token, async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
  }

    // Find the participant to be deleted
    const participant = await Participants.findById(id);

    if (!participant) {
      return res.status(404).json({ error:  'Participant not found' });
    }

    if (participant.sender.toString() !== user._id.toString() &&
        participant.receiver.toString() !== user._id.toString()) {
      return res.status(403).json({ error:  'Unauthorized to delete this participant' });
    }

    await Messages.deleteMany({ _id: { $in: participant.messages } });

    await Participants.findByIdAndDelete(id);

    res.json({ success: 'deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'internal server error' });
  }
});


/* participants messages */
router.get('/get/user/messages/:id', verify_token, async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const message = await Messages.find({
      "$or" : [
        { sender : user?._id, receiver : id },
        { sender : id, receiver :  user?._id}
    ]
  }).sort({createdAt: 1})

    const groupedMessages = message.reduce((acc, message) => {
      const date = new Date(message.createdAt).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(message);
      return acc;
    }, {});

    const response = Object.keys(groupedMessages).map(date => ({
      date,
      messages: groupedMessages[date]
    }));
    res.json({ success: response });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;