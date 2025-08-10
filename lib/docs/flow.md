# Project Flow

This document provides a detailed, in-depth explanation of the MORA bot's program flow, from initial launch to command execution.

## 1. The Launcher: `lyion.js`

The application's entry point is `lyion.js`. This script's primary role is not to run the bot directly, but to act as a resilient launcher and process manager for the main bot script (`index.js`).

### Key Mechanism: `child_process.fork()`

Instead of running the bot's code in the same process, `index.js` uses `child_process.fork()`.

```javascript
// lyion.js
const { fork } = require("child_process");

function start() {
  const child = fork("./bot.js", process.argv.slice(2));

  child.on("exit", (code) => {
    if (code === 100) {
      console.log("Restart signal received. Restarting bot...");
      start();
    } else {
      // ... handle other exit codes
    }
  });
}

start();
```

- **Forking vs. Spawning:** `fork` is a special case of `child_process.spawn` specifically for creating new Node.js processes. The key benefit is that it establishes an IPC (Inter-Process Communication) channel, allowing the parent and child to send messages to each other (though this feature isn't heavily used here).
- **Resilience:** The `child.on("exit", ...)` block is crucial. It listens for the child process to terminate. If the bot exits with a specific code (`100`), the launcher interprets this as a signal to restart, and it calls `start()` again. This creates a loop that keeps the bot running even if it crashes or requests a restart (e.g., after an update).
- **Argument Forwarding:** `process.argv.slice(2)` forwards the command-line arguments passed to `lyion.js` directly to the `bot.js` child process.

## 2. The Core: `bot.js`

This is the main application file where the WhatsApp connection is managed.

### Initialization and Dependencies

The script starts by importing all necessary modules:

- `baileys-pro`: The core library for interacting with the WhatsApp Web API.
- `@hapi/boom`: For creating custom, structured error objects.
- `pino`: A high-performance JSON logger.
- `chalk`: For styling terminal output with colors.
- `./lib/core/executeCommand`: The command execution engine.
- `./lib/commands`: The command loader and resolver.

### The `MORA()` Connection Function

This `async` function encapsulates the entire lifecycle of a WhatsApp session.

#### a. Authentication and State Management

```javascript
// bot.js
const { state, saveCreds } = await useMultiFileAuthState("session");
```

- `useMultiFileAuthState`: This is a key function from Baileys. It sets up persistent session management. Instead of storing all session credentials (keys, registration info, etc.) in a single massive JSON file, it saves them across multiple files in the specified directory (`session/`). This is more efficient and easier to manage.
- `state`: An object containing the credentials and keys needed for authentication.
- `saveCreds`: A function that is called whenever the credentials update. It automatically saves the changes to the `session/` directory. This is hooked into the socket's `creds.update` event later.

#### b. Socket Creation

```javascript
// bot.js
const sock = makeWASocket({
  version: [2, 3000, 1023223821], // Custom version
  logger,
  printQRInTerminal: false,
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, logger),
  },
  msgRetryCounterCache,
  // ... other options
});
```

`makeWASocket` creates the main socket object. The configuration provided is critical:

- `logger`: Attaches the `pino` logger to Baileys for detailed debugging output.
- `printQRInTerminal`: Set to `false` because this bot uses a more advanced pairing code method.
- `auth`: This is the most important part. It's passed the `state` object from `useMultiFileAuthState`. `makeCacheableSignalKeyStore` wraps the cryptographic keys in a cache for faster access.
- `msgRetryCounterCache`: A cache to keep track of message retry attempts, preventing spam and handling network issues.

#### c. New User Pairing Flow

If no session exists (`!sock.authState.creds.registered`), the bot initiates a pairing sequence:

1.  It prompts the user for their WhatsApp number via the command line.
2.  It calls `sock.requestPairingCode(sanitizedNumber, pairCode)`.
3.  This communicates with WhatsApp servers to generate a short, temporary code (e.g., `ABCD-EFGH`).
4.  The user must then enter this code on their phone under `WhatsApp > Linked Devices > Link with phone number`. This is a more modern and secure method than scanning a QR code in the terminal.

#### d. Event Handling (`sock.ev.on`)

The bot's logic is almost entirely event-driven.

- `connection.update`: Manages the connection state. If the connection closes for any reason other than being `DisconnectReason.loggedOut` (which means the user manually unlinked the bot), it attempts to reconnect by calling `MORA()` again. If it was logged out, it exits with code `100`, signaling the `lyion.js` launcher to restart the process from scratch (forcing a new pairing).
- `creds.update`: This event fires whenever the session credentials change. It simply calls `saveCreds` to persist these changes to the `session/` directory, ensuring the session can be resumed after a restart.
- `messages.upsert`: This is the heart of the command system. It fires for every new message the bot receives.

## 3. Command Pipeline: From Message to Execution

The `messages.upsert` event triggers the command processing pipeline.

```javascript
// bot.js: inside 'messages.upsert' handler
for (const m of event.messages) {
  const message =
    m.message?.conversation || m.message?.extendedTextMessage?.text;

  // 1. Prefix Check
  if (!message || !message.startsWith(settings.prefix)) continue;

  // 2. Tokenization
  const tokens = message.trim().split(/\s+/);
  const commandName = tokens[0].slice(settings.prefix.length).toLowerCase();

  // 3. Command Resolution
  const command = resolveCommand(commandName);
  if (!command) continue;

  // 4. Execution
  await executeCommand({ m, sock, tokens });
}
```

1.  **Prefix Check:** The bot ignores any message that doesn't start with the prefix defined in `config.js` (e.g., `+`).
2.  **Tokenization:** The message content is split by whitespace into an array of "tokens". The first token is the potential command name.
3.  **Command Resolution:** `resolveCommand` (from `lib/resolve.js`) is called. It checks if the `commandName` matches a command's primary name or any of its registered aliases. If no match is found, the process stops.
4.  **Execution:** If a command is found, the entire context (`m`, `sock`, `tokens`) is handed over to `lib/core/executeCommand.js` to manage the final execution step.
