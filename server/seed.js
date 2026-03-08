/**
 * Seed script — creates dummy users, matches some with Dan's account,
 * and populates conversations with messages.
 *
 * Usage:
 *   node seed.js [your-email]
 *
 * Defaults to dan@example.com if no email is provided.
 * Clears ALL existing data before seeding.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Swipe = require('./models/Swipe');
const Match = require('./models/Match');
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');

const YOUR_EMAIL = process.argv[2] || 'dan@example.com';
const YOUR_NAME = 'Dan';
const YOUR_PASSWORD = 'password123';

// ── Dummy profiles ──────────────────────────────────────────────────────────

const dummyUsers = [
  {
    name: 'Maya Chen',
    email: 'maya@fake.com',
    bio: 'Coffee snob. Trail runner. Building stuff with code.',
    gender: 'female',
    age: 27,
    question: { text: 'What\'s the best IDE?', options: ['VS Code', 'IntelliJ', 'Vim', 'Notepad'], correctIndex: 0 },
  },
  {
    name: 'Sophie Laurent',
    email: 'sophie@fake.com',
    bio: 'Pastry chef by day, gamer by night. Fluent in French and sarcasm.',
    gender: 'female',
    age: 25,
    question: { text: 'Best croissant filling?', options: ['Chocolate', 'Almond', 'Ham & cheese', 'Nothing, plain is king'], correctIndex: 3 },
  },
  {
    name: 'Alex Rivera',
    email: 'alex@fake.com',
    bio: 'Photographer. Vinyl collector. Makes a mean espresso martini.',
    gender: 'male',
    age: 29,
    question: { text: 'Best music decade?', options: ['60s', '70s', '80s', '90s'], correctIndex: 2 },
  },
  {
    name: 'Jordan Park',
    email: 'jordan@fake.com',
    bio: 'Non-binary queen. Data scientist who unironically loves spreadsheets.',
    gender: 'nonbinary',
    age: 26,
    question: { text: 'Tabs or spaces?', options: ['Tabs', 'Spaces', 'Whatever the formatter says', 'I use Scratch'], correctIndex: 2 },
  },
  {
    name: 'Emma Okafor',
    email: 'emma@fake.com',
    bio: 'ER nurse. Bookworm. Will absolutely destroy you at Mario Kart.',
    gender: 'female',
    age: 28,
    question: { text: 'Best Mario Kart character?', options: ['Toad', 'Yoshi', 'Peach', 'Dry Bones'], correctIndex: 3 },
  },
  {
    name: 'Liam Nakamura',
    email: 'liam@fake.com',
    bio: 'Architect. Climber. Dog dad to a very dramatic husky.',
    gender: 'male',
    age: 31,
    question: { text: 'Best dog breed?', options: ['Golden Retriever', 'Husky', 'Corgi', 'Mutt'], correctIndex: 1 },
  },
  {
    name: 'Priya Sharma',
    email: 'priya@fake.com',
    bio: 'Startup founder. Yoga addict. Will talk your ear off about space.',
    gender: 'female',
    age: 30,
    question: { text: 'Coolest planet?', options: ['Mars', 'Saturn', 'Jupiter', 'Earth (boring but true)'], correctIndex: 1 },
  },
  {
    name: 'Kai Martinez',
    email: 'kai@fake.com',
    bio: 'DJ on weekends. Frontend dev on weekdays. Cat person.',
    gender: 'male',
    age: 24,
    question: { text: 'Best JS framework?', options: ['React', 'Vue', 'Svelte', 'jQuery forever'], correctIndex: 2 },
  },
  {
    name: 'Zoe Williams',
    email: 'zoe@fake.com',
    bio: 'Marine biologist. Surfer. Will send you way too many otter facts.',
    gender: 'female',
    age: 27,
    question: { text: 'Cutest sea creature?', options: ['Otter', 'Seahorse', 'Clownfish', 'Jellyfish'], correctIndex: 0 },
  },
  {
    name: 'Sam Patel',
    email: 'sam@fake.com',
    bio: 'Stand-up comedian. Makes really good dal. Terrible at golf.',
    gender: 'male',
    age: 28,
    question: { text: 'Best comedy special?', options: ['Nanette', 'Sticks & Stones', 'Inside', 'Killin\' Them Softly'], correctIndex: 2 },
  },
  {
    name: 'Riley Tran',
    email: 'riley@fake.com',
    bio: 'Game designer. Pixel art enthusiast. Always has snacks.',
    gender: 'nonbinary',
    age: 23,
    question: { text: 'Best retro console?', options: ['SNES', 'Genesis', 'N64', 'PS1'], correctIndex: 0 },
  },
  {
    name: 'Olivia Kim',
    email: 'olivia@fake.com',
    bio: 'Tattoo artist. Plays bass in a band you haven\'t heard of.',
    gender: 'female',
    age: 26,
    question: { text: 'Best tattoo placement?', options: ['Forearm', 'Back', 'Ribs', 'Behind the ear'], correctIndex: 0 },
  },
  {
    name: 'Marcus Johnson',
    email: 'marcus@fake.com',
    bio: 'Personal trainer. History nerd. Makes sourdough every Sunday.',
    gender: 'male',
    age: 32,
    question: { text: 'Best bread?', options: ['Sourdough', 'Baguette', 'Focaccia', 'Naan'], correctIndex: 0 },
  },
  {
    name: 'Ava Moreno',
    email: 'ava@fake.com',
    bio: 'Documentary filmmaker. Collects vintage cameras. Tea over coffee.',
    gender: 'female',
    age: 29,
    question: { text: 'Best documentary?', options: ['Planet Earth', 'Free Solo', 'Jiro Dreams of Sushi', 'Won\'t You Be My Neighbor?'], correctIndex: 2 },
  },
  {
    name: 'Tyler Brooks',
    email: 'tyler@fake.com',
    bio: 'Mechanical engineer. Homebrew hobbyist. Knows way too much about F1.',
    gender: 'male',
    age: 30,
    question: { text: 'Best F1 team?', options: ['Ferrari', 'McLaren', 'Red Bull', 'Mercedes'], correctIndex: 1 },
  },
];

// ── Random responses for conversations ──────────────────────────────────────

const randomResponses = [
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
  "You've clearly never met my cat",
  "Adding that to my bucket list right now",
  "I feel so seen rn",
  "Brb googling that",
  "You had me at hello honestly",
  "That's a hot take and I'm here for it",
  "Okay we need to get food sometime, just saying",
  "My friends would love you",
  "I can't believe I swiped right and got THIS quality content",
  "You're literally the only interesting person on this app",
  "Wait are you actually serious?? 😂",
  "Tell me your top 3, go",
  "I'm stealing that line",
  "Okay but are you free this weekend?",
  "This app was worth downloading after all",
];

const openers = [
  "Hey! Your profile cracked me up 😄",
  "Okay your question was impossible but I got it right so...",
  "Hi! I love your bio",
  "Your taste is immaculate, just saying",
  "Hey! So what's your go-to order?",
  "Alright, I'm curious — what made you swipe right?",
];

// ── Coordinates near SF for geo queries ─────────────────────────────────────

function randomSFLocation() {
  const baseLng = -122.4194;
  const baseLat = 37.7749;
  return {
    type: 'Point',
    coordinates: [
      baseLng + (Math.random() - 0.5) * 0.1,
      baseLat + (Math.random() - 0.5) * 0.1,
    ],
    city: 'San Francisco',
  };
}

// ── Main seed ───────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Wipe everything
  await Promise.all([
    User.deleteMany({}),
    Swipe.deleteMany({}),
    Match.deleteMany({}),
    Conversation.deleteMany({}),
    Message.deleteMany({}),
  ]);
  console.log('Cleared all collections');

  // Create Dan's account
  const dan = await User.create({
    email: YOUR_EMAIL,
    password: YOUR_PASSWORD,
    name: YOUR_NAME,
    bio: 'Just a coder looking for good vibes.',
    photos: [],
    question: {
      text: 'What language is the best?',
      options: ['JavaScript', 'Python', 'Rust', 'Go'],
      correctIndex: 0,
    },
    location: randomSFLocation(),
    gender: 'male',
    interestedIn: ['female', 'male', 'nonbinary', 'other'],
    age: 28,
    profileComplete: true,
  });
  console.log(`Created your account: ${YOUR_EMAIL} / ${YOUR_PASSWORD}`);

  // Create dummy users
  const createdUsers = [];
  for (const u of dummyUsers) {
    const user = await User.create({
      email: u.email,
      password: hashedPw,
      name: u.name,
      bio: u.bio,
      photos: [],
      question: u.question,
      location: randomSFLocation(),
      gender: u.gender,
      interestedIn: ['female', 'male', 'nonbinary', 'other'],
      age: u.age,
      profileComplete: true,
    });
    createdUsers.push(user);
  }
  console.log(`Created ${createdUsers.length} dummy users`);

  // Match Dan with ~6 users (mutual right swipes with correct answers)
  const matchCount = 6;
  const matchedUsers = createdUsers.slice(0, matchCount);

  for (const user of matchedUsers) {
    // Dan swiped right on them and answered correctly
    await Swipe.create({ swiper: dan._id, target: user._id, direction: 'right', answeredCorrectly: true });
    // They swiped right on Dan and answered correctly
    await Swipe.create({ swiper: user._id, target: dan._id, direction: 'right', answeredCorrectly: true });

    // Create match + conversation
    const conversation = await Conversation.create({
      participants: [dan._id, user._id],
    });
    await Match.create({
      users: [dan._id, user._id],
      conversation: conversation._id,
    });

    // Seed a few messages in the conversation
    const msgCount = 2 + Math.floor(Math.random() * 5);
    let lastMsg;
    const opener = openers[Math.floor(Math.random() * openers.length)];

    // They open
    lastMsg = await Message.create({
      conversation: conversation._id,
      sender: user._id,
      text: opener,
      createdAt: new Date(Date.now() - (msgCount + 1) * 60000 * 30),
    });

    for (let i = 0; i < msgCount; i++) {
      const sender = i % 2 === 0 ? dan._id : user._id;
      const text = randomResponses[Math.floor(Math.random() * randomResponses.length)];
      lastMsg = await Message.create({
        conversation: conversation._id,
        sender,
        text,
        createdAt: new Date(Date.now() - (msgCount - i) * 60000 * 30),
      });
    }

    await Conversation.findByIdAndUpdate(conversation._id, { lastMessage: lastMsg._id });
    console.log(`  Matched with ${user.name} (${msgCount + 1} messages)`);
  }

  // Remaining users are in the feed (no swipes yet)
  console.log(`  ${createdUsers.length - matchCount} users available in feed`);

  console.log('\n✅ Seed complete!');
  console.log(`   Login: ${YOUR_EMAIL} / ${YOUR_PASSWORD}`);
  console.log(`   ${matchCount} matches with conversations`);
  console.log(`   ${createdUsers.length - matchCount} users in discovery feed`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
