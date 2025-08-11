const fs = require("fs");
const chalk = require("chalk");

// Bot Info
global.botName = "Lyion";
global.ownerName = "Reaper"; // Change this to your name
global.ownerNumber = ["573171405478"]; // Change this to your WhatsApp number (e.g., ['6281234567890'])
global.botVersion = "1.1.0";

// Bot Settings
global.prefix = "+"; // Define the prefix for commands
global.sessionName = "lyion_session"; // Folder name to save session
global.publicMode = false; // Set to true to allow anyone to use the bot, false for owner only

global.packname = `Lyion Bot`;
global.author = global.ownerName;

//Api Keys
global.googleApiKey = process.env.GOOGLE_API_KEY || ""; // Google API Key
global.googleSearchEngineId = process.env.GOOGLE_CSE_ID || ""; // Google Custom Search Engine ID
global.geminiApiKey = process.env.GOOGLE_API_KEY || "";
//logging settings
global.logging = {
  level: "info", // error, warn, info, debug, trace
  logToFile: true,
  maxFileSize: "10m",
  maxFiles: "7d",
};

// Don't change below this line
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update'${__filename}'`));
  delete require.cache[file];
  require(file);
});
