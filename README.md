# Lyion Bot

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)![Version: 1.0.0](https://img.shields.io/badge/Version-1.0.0-blue.svg)

A simple, feature-rich WhatsApp bot built with Baileys.

## Table of Contents

- [About the Bot](#about-the-bot)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)Important Notes About Socket Config
    Caching Group Metadata (Recommended)
    If you use baileys for groups, we recommend you to set cachedGroupMetadata in socket config, you need to implement a cache like this:

const groupCache = new NodeCache({stdTTL: 5 \* 60, useClones: false})

const sock = makeWASocket({
cachedGroupMetadata: async (jid) => groupCache.get(jid)
})

sock.ev.on('groups.update', async ([event]) => {
const metadata = await sock.groupMetadata(event.id)
groupCache.set(event.id, metadata)
})

sock.ev.on('group-participants.update', async (event) => {
const metadata = await sock.groupMetadata(event.id)
groupCache.set(event.id, metadata)
})

- [Usage](#usage)
- [Command List](#command-list)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## About the Bot

Lyion Bot is a versatile WhatsApp bot designed to be easily extensible and configurable. It uses a command-based system to provide a wide range of features, from simple fun commands to powerful AI-driven interactions.

## Features

- **Dynamic Command Loading:** Commands are loaded dynamically from the `lib/commands` directory.
- **AI Integration:** Uses Google's Gemini AI for natural language processing and command execution.
- **Group Management:** Features for managing group participants (add, remove, promote, demote).
- **Customizable Configuration:** Easily configure the bot's name, owner, prefix, and API keys.
- **Session Management:** Uses a file-based session to stay logged in.
- **Public and Private Modes:** Can be configured to be used by anyone or only the bot owner.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1.  **Clone the repository:**
    ````bash
    git clone https://github.com/Tonyjnr/lyion-bot.git
    cd lyion-bot
    ```2.  **Install dependencies:**
    ```bash
    npm install
    ````

### Configuration

All configuration is done in the `config.js` file. Here are the key variables to set:

- `botName`: The name of your bot.
- `ownerName`: Your name.
- `ownerNumber`: Your WhatsApp number (e.g., `['6281234567890']`).
- `prefix`: The prefix for commands (e.g., `+`).
- `publicMode`: `true` to allow anyone to use the bot, `false` for owner only.
- `googleApiKey`: Your Google API Key.
- `googleSearchEngineId`: Your Google Custom Search Engine ID.
- `geminiApiKey`: Your Gemini API Key.

## Usage

1.  **Start the bot:**
    ```bash
    npm start
    ```
2.  **PairCode Request:**
    input your number: eg 573171405478, and input the paircode below in the prompt.....

    PairCode: `LYIONBOT`

## Command List

For a complete and always up-to-date list of available commands, please use the `menu` command directly with the bot.

### Usage

To see all available commands, type:

```
+menu
```

The `menu` command dynamically generates a list of all registered commands, grouped by category, ensuring the information is always accurate.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Copyright (c) 2025 Onuzulike Anthony Ifechukwu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Author

- **Reikernodd**
