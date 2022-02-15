const mineflayer = require('mineflayer')


// Function for filtering out IGN
function regex(txt) {
  let ign

  // Delete all the dashed lines in party invite
  let result = txt.replace("-----------------------------", "")

  // Search for a rank in player ign (EX. [VIP], [VIP+], etc)
  let search = result.search("]")

  // If it can't find a rank, it means that the player is a non
  if(search == -1) {
    // The IGN is the 1st word of the invite
    ign = result.split(' ')[0]

  } else {
    // The IGN is the 2nd word of the invite
    ign = result.split(' ')[1]
  }

  return ign
}


// Check if the correct arguments were given
if (process.argv.length < 4 || process.argv.length > 6) {
  console.log('Usage : node FragBot.js <host> [<email>] [<password>] [<auth_type]')
  process.exit(1)
}


// Create Bot instnace
const bot = mineflayer.createBot({
  host: process.argv[2],
  username: process.argv[3],
  password: process.argv[4],
  auth: process.argv[5]
})


// When Bot is logged in, send into island with afk pool
bot.once('spawn', () => {
  console.log("Successfully joined!\n")

  // Join Skyblock after 1 second so that the bot can load in correctly
  setTimeout(() => {
    bot.chat("/play sb")
  }, 1000)

  setTimeout(() => {
    bot.chat("/is")
  }, 2000)
})


// Check Chat
bot.on('messagestr', (message) => {
  // For some reason the chat fills up with the bot's stats in sb, so ignore
  if(message.search("❤") == -1) {
    // If party request has been sent to bot
    if(message.search("party!\nYou") != -1) {
      // Filter out IGN in the party invite message
      let ign = regex(message)

      // Accept party
      bot.chat("/party accept " + ign)

      // Leave party after 5 seconds
      setTimeout(() => {
        bot.chat("/party leave")
      }, 5000)
    }

    // Log chat messages
    console.log(message)
  }
})


// If Bot is kicked, give reason for troubleshooting
bot.on('kicked', (reason) => {
  console.log("Bot was kicked for reason: " + reason)
})
