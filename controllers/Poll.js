const Poll = require('../models/Poll');
const User = require('../models/auth');
const InAppNotification = require('../models/InAppNotification');

// Create a new Community Poll
const createPoll = async (req, res) => {
  try {
    const { question, options, expiresAt } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID missing' });
    }

    if (!question || !options || !Array.isArray(options) || options.length < 2 || !expiresAt) {
      return res.status(422).json({ message: 'All fields are required. Include a question, at least 2 options, and an expiry date.' });
    }

    // Map string options to objects { optionText, votes: 0 }
    const formattedOptions = options.map(opt => ({
      optionText: opt.trim(),
      votes: 0
    }));

    const newPoll = new Poll({
      question,
      options: formattedOptions,
      expiresAt: new Date(expiresAt),
      createdBy: 'admin'
    });

    await newPoll.save();

    // Notify all users about the new poll
    try {
      const users = await User.find({ role: 'user' });
      for (const u of users) {
        await InAppNotification.create({
          recipientId: u._id,
          title: 'New Community Poll',
          body: `An admin has posted a new poll: "${question}". Let your voice be heard!`,
          type: 'poll',
          referenceId: newPoll._id
        });
      }
    } catch (inAppErr) {
      console.error("Error creating notifications for new poll:", inAppErr);
    }

    res.status(201).json({
      message: 'Poll created successfully',
      data: newPoll
    });

  } catch (error) {
    console.error("Error creating poll:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all polls
const getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.status(200).json(polls);
  } catch (error) {
    console.error("Error fetching polls:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Vote on a poll option
const voteInPoll = async (req, res) => {
  try {
    const { pollId, optionId } = req.body;
    const userId = req.user.id;

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found.' });
    }

    // Check if expired
    if (new Date() > new Date(poll.expiresAt)) {
      return res.status(400).json({ message: 'This poll has expired and is closed for voting.' });
    }

    // Check if already voted
    if (poll.votedUserIds.includes(userId)) {
      return res.status(400).json({ message: 'You have already cast your vote in this poll.' });
    }

    // Find the option and increment vote count
    const option = poll.options.id(optionId);
    if (!option) {
      return res.status(400).json({ message: 'Invalid option selected.' });
    }

    option.votes += 1;
    poll.votedUserIds.push(userId);

    await poll.save();

    res.status(200).json({
      message: 'Vote cast successfully',
      data: poll
    });

  } catch (error) {
    console.error("Error casting vote:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a poll
const deletePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPoll = await Poll.findByIdAndDelete(id);

    if (!deletedPoll) {
      return res.status(404).json({ message: 'Poll not found.' });
    }

    res.status(200).json({ message: 'Poll deleted successfully' });
  } catch (error) {
    console.error("Error deleting poll:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createPoll,
  getAllPolls,
  voteInPoll,
  deletePoll
};
