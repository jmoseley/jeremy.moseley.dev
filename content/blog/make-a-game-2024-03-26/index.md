---
title: "Journal: A CRUD developer builds a game"
date: 2024-03-26
tags:
  - game development
  - godot
  - movement
  - press and drag
---

## What did I do today?

Big update today! I think I have a POC for the core movement mechanic. It will be much better on mobile. Now the user taps and drags on the tank to draw a path, and the tank will follow the path. The game pauses while the user draws. It will continue to be tweaked, but I think its a good place to start. I removed the keyboard controls for now, but I think I will add them back in later to make it more usable on desktop/laptop.

[Check it out](/iron-fury/builds/2024-03-26).

I also added a new weapon mechanic, an airstrike. This is a missile/bomb thingy that drops and causes a bunch of damage within a radius. Right now it just shoots toward the biggest groups of enemies, but eventually I'll make it a thing the user can control, both in terms of where to shoot and when to shoot.

## What did I learn?

- Godot has a pretty useful `pause` interface, makes it easier to just stop everything.
- I used my first texture to drop a dashed line. Cool!

### Path drawing code

Here is the code I used to draw the path. In this code `$GhostPlayer` is a sprite that has the same texture as the player tank (a green tank body), and has `pause_mode = Node.PAUSE_MODE_PROCESS` so that it is redrawn on screen when its position changes. `$GhostCover` is a `ColorRect` overlay that is used to partially cover the screen while the user is drawing the path, to show that things are stopped. `$GhostPath` is a `Line2D` that is used to draw the path the user is drawing.

```python
export var player_click_radius = 100
var player_dragging = false

func _input(event):
	# Mouse in viewport coordinates.
	if event is InputEventScreenTouch or (event is InputEventMouseButton and event.button_index == BUTTON_LEFT):
		if (event.position - get_node('/root/Main/Player').position).length() < player_click_radius:
			if event.pressed && !player_dragging:
				get_tree().paused = true
				player_dragging = true
				$GhostPlayer.show()
				$GhostPlayer.position = event.position
				$GhostCover.show()
				$GhostPlayer.rotation = get_node('/root/Main/Player').rotation
				$GhostPath.show()
				$GhostPath.clear_points()
				$GhostPath.add_point(get_node('/root/Main/Player').position)

		if !event.pressed && player_dragging:
			player_dragging = false
			get_tree().paused = false
			$GhostPlayer.hide()
			$GhostCover.hide()
			# $GhostPath.hide()

	if player_dragging && (event is InputEventMouseMotion or event is InputEventScreenDrag):
		$GhostPlayer.position = event.position
		# "smoothly" rotate to the mouse move direction
		$GhostPlayer.rotation = lerp_angle($GhostPlayer.rotation, event.speed.angle(), 0.5)
		if $GhostPath.get_point_count() == 0 or ($GhostPath.get_point_position(0) - event.position).length() > 20:
			$GhostPath.add_point(event.position, 0)
```

### Player movement code

Here is the code I use for the player to follow the path. I use `move_and_slide` to move the player for two reasons: 1) it allows us to still get collisions, so if the user draws a path that goes through a wall, the player will stop at the wall, and 2) we can still include the knockback effect that I added in the last update.

```python
func _physics_process(_delta):
	position.x = wrapf(position.x, 0, screen_size.x)
	position.y = wrapf(position.y, 0, screen_size.y)
	# control(delta)

	if health <= 0:
		return

	var path : Line2D = get_node("/root/Main/HUD/GhostPath")
	if path.points.size() > 0:
		var target = path.points[path.points.size()-1]
		if position.distance_to(target) < 3:
			path.remove_point(path.points.size()-1)
			if path.points.size() > 0:
				target = path.points[path.points.size()-1]
			else:
				target = position
		movement_velocity = (target - position).normalized() * speed

	move_and_slide(movement_velocity + impulse_velocity)
	if movement_velocity.length() > 0:
		rotation = lerp_angle(rotation, movement_velocity.angle() - PI/2, 0.2)
	movement_velocity = movement_velocity.linear_interpolate(Vector2(), 0.3)
	impulse_velocity = impulse_velocity.linear_interpolate(Vector2(), 0.1)
```

## Future improvements

A few improvements can be made to this effect:

1. Drawing the line smoothly: In order to keep the dashes stable when the tank follows the path, I actually draw it by appending to the head of the line. But this leads to the dashes shifting as the line is draw, and just looks weird. Not a problem now, but will fix down the road.
2. Collisions: I'd like to prevent the player from drawing impossible paths. Right now the tank will just get stuck if the path goes through a wall, or too close to a wall, so it can be tricky for the player. I'd prefer to prevent impossible paths from being drawn at all, or find a better way to prevent the tank from getting stuck. But what we have is ok for now.

## What's next?

1. Experiment with a tap-to-shoot powerups mechanic. The user will press and hold somewhere that isn't the tank, and get a menu to select any available powerups, and either drag to select and shoot, or tap, or something like that.
2. More complex (and larger) levels. I'm going to build some levels that are larger, so that the user can move further. It will be interesting to balance this with the path drawing movement mechanic. I think I will allow the user to draw/scroll so they can draw a path that goes anywhere within the level, even if its not visible.

## Demo

Click [here](/iron-fury/builds/2024-03-26) to play.

Draw a path by pressing and dragging on the green tank.
