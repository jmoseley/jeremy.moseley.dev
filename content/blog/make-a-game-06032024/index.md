---
title: "Journal: A CRUD developer builds a game"
date: 2024-03-03
tags:
  - game development
  - learning
  - godot
---

## What did I do today?

I got the core pieces of a "game" put together. Enemies shoot and move, the player can die, and the whole thing restarts. No sound or UI yet, but it's a start.

[Check it out](#demo).

Ooooh. I think I settled on a name. The working title was "Tanks of Fury", but there are some other games that sort of have that name, plus that movie.

:drumroll:

{% image "./wip-logo.png", "Iron Fury wip logo", "400", "400" %}

## What did I learn?

- The details can be really fiddly. It was a bit tedious getting the right combination of `PI / 2` and graphical rotations, but it all got sorted eventually.
- I'm starting to understand the power of the Godot engine. It's pretty cool how much it does for you. I still think I'm not really leveraging nodes and signals quite right, but I'm getting there. I think there are better ways to do code reuse as well, but it's ok for now.

## What's next?

1. Add some UI. I want to show the player's health and score. Still not sure what score will be.
2. Add some sound. I think I can find some free sound effects on the internet.
3. Add some polish. I need to make the game over screen look better, and I need to make the game feel better to play. I think I need to add some screen shake when the player gets hit, and I need to add some feedback when the player shoots.

## Demo

Click [here](/iron-fury/builds/06032024) to play.

WASD or arrows to move, or click/touch to move.
