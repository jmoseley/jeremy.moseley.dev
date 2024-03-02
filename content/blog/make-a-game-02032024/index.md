---
title: "Journal: A CRUD developer builds a game"
date: 2024-03-02
tags:
  - game-development
  - learning
  - it-moves
---

## What did I do today?

I got some stuff to move on the screen, so that's cool. I borrowed [some art from the internet](https://kenney-assets.itch.io/top-down-tanks-redux), so that made it easy to get something on the screen.

[Check it out](#demo).

## What did I learn?

I'm starting to understand that system of nodes and signals in Godot. I think it will be pretty powerful once I get better thinking in that mindset.

Some things I learned today:

- The engine makes things like collision detection and movement pretty easy
- Godot 4 _is not_ ready if you hope to publish to Web (like the demo below)
  - I had to restart the project in Godot 3.5 to be able to publish something that works in the browser

Here is some code I wrote today to control the player:

```python
extends Area2D

export var speed = 400 # How fast the player will move (pixels/sec).
var screen_size # Size of the game window.
export var rotation_speed = 5

func _ready():
	screen_size = get_viewport_rect().size
	position = screen_size / 2
	rotation = PI / 2

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	var rotation_dir = 0
	if Input.is_action_pressed("turn_left"):
		rotation_dir -= 1
	if Input.is_action_pressed("turn_right"):
		rotation_dir += 1
	rotation += rotation_dir * rotation_speed * delta

	var move_direction = 0
	if Input.is_action_pressed("move_forward"):
		move_direction -= 1
	if Input.is_action_pressed("move_backward"):
		move_direction += 1

	var velocity = Vector2(move_direction, 0).rotated(rotation).normalized() * speed * delta
	position += velocity

	# if the player fully moves outside the screen, wrap around
	if position.x > screen_size.x:
		position.x = 0
	elif position.x < 0:
		position.x = screen_size.x
	if position.y > screen_size.y:
		position.y = 0
	elif position.y < 0:
		position.y = screen_size.y
```

## Demo

<iframe src="/tanks-of-fury/builds/02032024" width="480" height="720"></iframe>
```
