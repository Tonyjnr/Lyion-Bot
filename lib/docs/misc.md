# Miscellaneous Systems Deep Dive

This document covers other important systems that contribute to the bot's functionality, including configuration and command aliasing.

## 1. The Configuration System

The bot's configuration is highly flexible, designed to be changed at runtime without requiring a full restart.

### The `config.js` File

The `config.js` file is the active configuration file. It is loaded by the bot at startup and contains all global settings like `ownerNumber`, `prefix`, and API keys. Because it's included in the `.gitignore`, your personal settings won't be accidentally committed to version control.

### Hot-Reloading Mechanism

The bot "watches" the `config.js` file for any changes.

```javascript
// config.js
const fs = require("fs");
const chalk = require("chalk");

// ... global settings ...

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update'${__filename}'`));
  delete require.cache[file];
  require(file);
});
```

1.  **`fs.watchFile`**: This Node.js function attaches a listener to the file. Whenever the file is modified (i.e., saved), the callback function is triggered.
2.  **Cache Busting:** Node.js has a module cache. Once a file is `require`'d, it's stored in `require.cache`. If you just `require("./config.js")` again, you'll get the old, cached version. The line `delete require.cache[file]` is the critical step. It removes the old settings from the cache.
3.  **Re-requiring:** The next time `require(file)` is called, Node.js sees it's not in the cache and reads the file from disk again, loading the new, updated values.

This allows you to change the bot's `prefix`, `ownerNumber`, or other settings on the fly.

## 2. The Alias System

The bot supports one type of alias:

**Built-in Aliases**: These are defined directly in a command's file within the `aliases` array. They are hard-coded by the developer. For example, `p` for `ping`.

```javascript
// lib/commands/info.ping.js
module.exports = {
  name: "ping",
  aliases: ["p"],
  //...
};
```
