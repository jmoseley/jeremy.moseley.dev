---
title: "Journal: A CRUD developer builds a game"
date: 2024-03-03
tags:
  - game-development
  - learning
  - boom
  - godot
---

## What did I do today?

Now the turret moves, and bullets shoot. Random enemies drive across the screen, and the turret tracks the closest one. Copilot helped with some of the finicky angle math (I always struggle with that).

I also added the ability for bullets to damage enemies, and I added mouse/touch controls for movement. This makes it "playable" on mobile.

[Check it out](#demo).

Here is the interesting bits of code for tracking the enemy and aiming the turret:

```python
var time_since_last_shot = 0
# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	# every frame, add the time since the last frame to the time since the last shot
	time_since_last_shot += delta

	# todo: if the delta is too large, then the time since the last shot will be greater than the fire rate

	var parent_position = get_parent().position

	# if the time since the last shot is greater than the fire rate, then shoot
	if time_since_last_shot > 1 / fire_rate:
		emit_signal("shoot", parent_position, rotation - PI/2)
		time_since_last_shot = 0

	# aim towards the nearest enemy
	var mobs = get_tree().get_nodes_in_group("mobs")
	var nearest_mob = null
	# set the initial distance to infinity
	var nearest_mob_distance = float("inf")
	for mob in mobs:
		var distance = parent_position.distance_squared_to(mob.position)
		if distance < nearest_mob_distance or not nearest_mob:
			nearest_mob = mob
			nearest_mob_distance = distance

	var target_angle = get_parent().angle
	if nearest_mob:
		# change the angle of the turret to aim at the nearest enemy
		target_angle = parent_position.angle_to_point(nearest_mob.position)

	# rotate the turret towards the target angle with a maximum rotation speed, turning the shortest direction
	var angle_difference = target_angle - rotation
	if angle_difference > PI:
		angle_difference -= 2 * PI

	if angle_difference < -PI:
		angle_difference += 2 * PI

	var rotation_direction = 1
	if angle_difference < 0:
		rotation_direction = -1

	var rotation_amount = min(abs(angle_difference), rotation_speed * delta)
	rotation += rotation_amount * rotation_direction
```

The "shoot" signal is emitted from the turret, and the main scene listens for it and creates a bullet. The bullet is a simple scene with a `RigidBody2D` and a `Sprite` as a child. The bullet is added to the scene and given a velocity in the direction of the turret's rotation.

## Next steps

- Have the enemies shoot at the player
- Add some egregious explosions

## Demo

Click [here](/iron-fury/builds/03032024) to play.

WASD or arrows to move, or click/touch to move.
