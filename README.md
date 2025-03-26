# CardGameForge README

## Installation

To install CardGameForge, run:
`npm install cardgameforge`
If you want to use custom MUI theme install also the MUI package:
`npm install @mui/material @emotion/react @emotion/styled`

## Usage

The library contains two main modules: `cardgameforge/server` and `cardgameforge/client`.
The server module is used to create a game server, while the client module is used to create a game client.
To create a game server, use the following code:

```javascript
import { serverSetup } from 'cardgameforge/server';
serverSetup(args);
```

To create a game client, include the `GameContextProvider` from `cardgameforde/client`
at the root of your React app.\
\
For further usage check the [docs](docs.md) markdown.
