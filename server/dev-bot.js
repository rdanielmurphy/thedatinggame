/**
 * Dev bot — makes dummy users auto-reply to messages.
 * Only active when NODE_ENV !== 'production'.
 *
 * Import and call setupDevBot(io) from index.js.
 */

const Message = require('./models/Message');
const Conversation = require('./models/Conversation');

const responses = [
  "Haha that's awesome 😄",
  "No way, tell me more!",
  "Okay but have you tried it with hot sauce?",
  "I literally just said that to my friend yesterday",
  "Hmm, interesting take 🤔",
  "You're funny, I like that",
  "Wait what?? That's wild",
  "Okay I need to hear the full story",
  "Lmaooo stop 💀",
  "That's actually really cool",
  "I'm intrigued... go on",
  "Hard agree",
  "Nah you're wrong for that one 😂",
  "This is the best conversation I've had on here tbh",
  "Okay but what's your take on pineapple pizza?",
  "Adding that to my bucket list right now",
  "Brb googling that",
  "You had me at hello honestly",
  "That's a hot take and I'm here for it",
  "Okay we need to get food sometime, just saying",
  "Wait are you actually serious?? 😂",
  "Tell me your top 3, go",
  "Okay but are you free this weekend?",
  "This app was worth downloading after all 😊",
  "I can't stop laughing 😂",
  "You're making this too easy",
  "I just snorted, thanks for that",
  "Noted. Adding you to my favorites.",
  "I think we'd get along irl tbh",
  "My therapist would love this conversation",
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function setupDevBot(io) {
  if (process.env.NODE_ENV === 'production') return;

  console.log('🤖 Dev bot active — dummy users will auto-reply');

  // Hook into every new message via socket.io
  io.on('connection', (socket) => {
    socket.on('send_message', async ({ conversationId }) => {
      // Wait 1-4 seconds, then reply as the other user
      const delay = 1000 + Math.random() * 3000;
      setTimeout(async () => {
        try {
          const convo = await Conversation.findById(conversationId);
          if (!convo) return;

          // Find the other participant (the bot user)
          const botUserId = convo.participants.find(
            (p) => p.toString() !== socket.userId
          );
          if (!botUserId) return;

          const replyText = pick(responses);
          const message = await Message.create({
            conversation: conversationId,
            sender: botUserId,
            text: replyText,
          });
          await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: message._id,
            updatedAt: new Date(),
          });

          const populated = await message.populate('sender', 'name photos');
          io.to(conversationId).emit('new_message', populated);
        } catch (err) {
          console.error('Dev bot reply error:', err.message);
        }
      }, delay);
    });
  });

  // Also hook into REST message endpoint
  return function devBotMiddleware(req, res, next) {
    // Intercept POST to /api/messages/:conversationId
    const origJson = res.json.bind(res);
    res.json = function (data) {
      origJson(data);

      // If this was a successful message send, auto-reply
      if (req.method === 'POST' && res.statusCode < 300 && data?.message) {
        const conversationId = req.params.conversationId;
        const delay = 1000 + Math.random() * 3000;

        setTimeout(async () => {
          try {
            const convo = await Conversation.findById(conversationId);
            if (!convo) return;

            const botUserId = convo.participants.find(
              (p) => p.toString() !== req.user._id.toString()
            );
            if (!botUserId) return;

            const message = await Message.create({
              conversation: conversationId,
              sender: botUserId,
              text: pick(responses),
            });
            await Conversation.findByIdAndUpdate(conversationId, {
              lastMessage: message._id,
              updatedAt: new Date(),
            });

            // Emit via socket if available
            io.to(conversationId).emit(
              'new_message',
              await message.populate('sender', 'name photos')
            );
          } catch (err) {
            console.error('Dev bot REST reply error:', err.message);
          }
        }, delay);
      }
    };
    next();
  };
}

module.exports = { setupDevBot };
