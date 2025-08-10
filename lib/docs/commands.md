# Commands Deep Dive

This document provides a comprehensive guide to the command system, including file structure, properties, and the execution context.

## Command File Structure

Every command resides in its own file within the `lib/commands/` directory. The system is designed to be modular; to add a new command, you simply add a new file. To remove one, you delete its file.

Each command file must export a single object containing the command's properties and its `execute` function.

### Example: `lib/commands/info.ping.js`

```javascript
// lib/commands/info.ping.js
module.exports = {
  name: "ping",
  category: "info",
  aliases: ["p"],
  usePrefix: true,
  description: "Check bot response speed.",
  execute: async (lyion, m, args, mek) => {
    const startTime = Date.now();
    await m.reply("🏓 Pong!");
    const endTime = Date.now();
    await m.reply(`*Response Time:* ${endTime - startTime}ms`);
  },
};
```

---

## Command Properties Explained

The exported object contains all the core information about the command.

- **`name`**: `String`
  The official, primary name of the command. This is what the system uses to register the command. It should be unique.

- **`category`**: `String`
  A category name used to group related commands together. Common categories might be `info`, `group`, `owner`, `utility`.

- **`aliases`**: `Array<String>` (optional)
  An array of alternative names for the command. In the example, a user could type `+p` instead of `+ping`.

- **`usePrefix`**: `Boolean` (optional, default: `true`)
  Determines if the command requires the global prefix to be triggered.

- **`description`**: `String`
  A human-readable description of what the command does.

---

## The `execute` Function Explained

The `execute` function is the heart of the command. It's an `async` function that gets executed when the command is called. It receives the entire context of the command's invocation.

### The Context Parameters

- **`lyion`**: `Object`
  The active Baileys socket instance. This is your gateway to the WhatsApp API. You use this to send messages (`lyion.sendMessage`), get group metadata, etc.

- **`m`**: `Object`
  A simplified message object created by the `smsg` helper. This contains convenient properties and methods like `m.reply()`, `m.sender`, `m.chat`, etc.

- **`args`**: `Array<String>`
  An array of string arguments that appear after the command name. For `+getpp @user`, `args` would be `['@user']`.

- **`mek`**: `Object`
  The raw, unmodified message object from Baileys (`proto.IWebMessageInfo`). This contains the full, detailed message data.
