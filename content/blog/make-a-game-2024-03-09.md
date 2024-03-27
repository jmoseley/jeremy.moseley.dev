---
title: "Journal: A CRUD developer builds a game"
date: 2024-03-09
tags:
  - game development
  - learning
  - godot
  - physics
---

## What did I do today?

Today I switched the movement to use the physics engine. I think it feels a bit better, and makes a bunch of things better. It allows me to easily add level elements such as blocks and barriers, and prevents the enemies and the player from overlapping.

## What did I learn?

- The 2D physics engine has a pretty strong lean towards platformers, with built in gravity and stuff like that. To get the tank physics to work right, I had to do a bunch of stuff myself.
- Once you are playing in the realm of the physics engine, a bunch of stuff gets way easier though. I was able to build a simple level with some blocks and barriers in no time.

One problem I ran into was that I wanted to add some knock back effects, so the player and enemies will get knocked back when they get hit. I solved this by tracking two different velocities (one movement velocity, and one velocity for "impulses"). Here is the code for the player that shows how I put it together:

```python
func _process(delta):
	var nearest_mob = null
	var min_distance = INF
	for mob in get_tree().get_nodes_in_group("mobs"):
		var distance = mob.global_position.distance_to(position)
		if !nearest_mob || distance < min_distance:
			min_distance = distance
			nearest_mob = mob
	if nearest_mob:
		# change the angle of the turret to aim at the nearest enemy, with a maximum rotation speed
		$Turret.fire_rate = fire_rate
		$Turret.target_position = nearest_mob.global_position
	else:
		$Turret.fire_rate = 0
		$Turret.target_position = Vector2.INF

var target_position = Vector2.INF
var movement_velocity = Vector2()
var is_reversing = false
var impulse_velocity = Vector2()

func control(delta):
	if health <= 0:
		return

	var rotation_dir = 0
	if Input.is_action_pressed("turn_left"):
		rotation_dir = -1
		target_position = Vector2.INF
	if Input.is_action_pressed("turn_right"):
		rotation_dir = 1
		target_position = Vector2.INF
	rotation += rotation_dir * rotation_speed * delta

	if Input.is_action_pressed("move_forward"):
		is_reversing = false
		movement_velocity = Vector2(0, 1).rotated(rotation).normalized()
		target_position = Vector2.INF
	if Input.is_action_pressed("move_backward"):
		is_reversing = true
		target_position = Vector2.INF
		movement_velocity = Vector2(0, -1).rotated(rotation).normalized() / 2

	# if target_position is set, move towards it with a max rotation speed
	if target_position != Vector2.INF:
		is_reversing = false
		if (target_position - position).length() < 100:
			target_position = Vector2.INF
		else:
			# calculate the angle to the target position
			var angle_difference = get_angle_to(target_position) - PI / 2

			if angle_difference > PI:
				angle_difference -= 2 * PI
			elif angle_difference < -PI:
				angle_difference += 2 * PI

			rotation_dir = 1
			if angle_difference < 0:
				rotation_dir = -1

			var rotation_amount = min(abs(angle_difference), rotation_speed * delta)
			rotation += rotation_dir * rotation_amount
			movement_velocity = Vector2(0, 1).rotated(rotation).normalized()

func _physics_process(delta):
	position.x = wrapf(position.x, 0, screen_size.x)
	position.y = wrapf(position.y, 0, screen_size.y)
	control(delta)
	move_and_slide(movement_velocity * speed + impulse_velocity)
	movement_velocity = Vector2(0, -1 if is_reversing else 1).rotated(rotation).normalized() * movement_velocity.linear_interpolate(Vector2(), 0.1).length()
	impulse_velocity = impulse_velocity.linear_interpolate(Vector2(), 0.1)

func apply_impulse(direction, force):
	impulse_velocity += direction.normalized() * force

func _on_Player_hit(damage, location, velocity):
	apply_impulse(velocity, damage * 10)
	decrement_health(damage)
	if health <= 0:
		rotation = 0
		movement_velocity = Vector2()
		impulse_velocity = Vector2()
		$Body.animation = 'die'
		$Body.scale = Vector2(2, 2)
		$Body.play()
		$Body.connect("animation_finished", self, "_on_Body_animation_finished")
		$Turret.hide()
		$CollisionShape2D.set_deferred("disabled", true)
```

Things to note:

- Friction is basically manual, I interpolate between the current velocity and zero, and do the same for the impulse velocity
- I use `move_and_slide` to move the player, and just add together the impulse and movement velocities
- The movement velocity is always applied in the direction of the tank to mock the tank movement style, but is not very realistic. I may adjust the turning logic to be dependent on the movement velocity, and that might feel a bit better.

## What's next?

- Power ups, like health or movement boosy
- Some pathfinding type logic to drive around barriers
- New weapons (splash damage!?)

## Demo

Click [here](/iron-fury/builds/2024-03-09) to play.

WASD or arrows to move, or click/touch to move.
