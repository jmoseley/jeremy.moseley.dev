---
title: "Journal: A CRUD developer builds a game"
date: 2024-04-05
tags:
  - game development
  - godot
  - space
  - waves
---

## What did I do today?

I added some basic functionality for waves of enemies to make it feel a bit more like a game. I also added another type of enemy to add some variety.

[Check it out](/iron-fury/builds/2024-04-05).

Here is the basic code for the waves:

```gdscript
func start_wave():
	hud.show_message('Wave ' + str(wave))
	game_running = true
	wave_timer.wait_time = 15 + wave
	wave_timer.start()
	for _i in range(wave * 3):
		spawn(MobType.FIGHTER)
	if wave > 3:
		for _i in range(wave / 2):
			spawn(MobType.BOMBER)
```

## Demo

Click [here](/iron-fury/builds/2024-04-05) to play.

Draw a path by pressing and dragging on the green tank. You can also use arrows or WASD on desktop.
