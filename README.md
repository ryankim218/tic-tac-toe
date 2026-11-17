# Elemental Clash

Elemental Clash is a two-player tic-tac-toe game for one device. Players take turns on a shared board, choose their own names and symbols, and keep a scoreboard that stays in the browser between visits.

## Features

- Local two-player matches with alternating turns
- Win detection for every row, column, and diagonal, plus draw detection
- The opening move alternates after each new round
- Custom names and 16 symbols, with duplicate symbols blocked
- Scoreboard for both players, draws, and games played
- New Game keeps the scoreboard; Reset Scoreboard asks before clearing it
- Names, symbols, and scores persist in `localStorage`
- Responsive layout, keyboard-reachable board, and reduced-motion support

## Technology stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Lucide React

No environment variables are required.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
npm run build
npm start
```

## Checks

```bash
npx tsc --noEmit
npm run lint
npx tsx scripts/verify-game.ts
```
