---
title: "Journal: A CRUD developer builds a game"
date: 2024-03-28
tags:
  - game development
  - godot
  - camera
  - level
---

## What did I do today?

I added a bare bones level that is larger than the screen, and tweaked the camera logic to follow the tank, but also move when drawing the path. That part was quite tricky, but it is working acceptably now.

[Check it out](/iron-fury/builds/2024-03-28).

### Moving the Camera

The camera follows the player by default, however, when drawing the path, I added some logic to scroll the camera around if you are near the edges of the screen. Here is the code for that. Every frame, I check the last position of a mouse move event, and if its near the edge of the screen, I move the camera in that direction. I adjust the speed of the camera depending how close to the edge you are. I also move the ghost player and add points to the path.

```gdscript
var player_dragging = false
var camera_speed = 800
var last_drag_position = Vector2()
var last_global_position = Vector2()

func _process(delta):
	# move the camera if the player is dragging and near the edges of the screen
	if player_dragging:
		var camera: Camera2D = get_node("/root/Main/Camera")
		var global_position = get_viewport().get_canvas_transform().affine_inverse() * last_drag_position
		var viewport_size = get_viewport().size
		var camera_position = camera.global_position
		if last_drag_position.x < 200:
			camera_position.x -= min(camera_speed * (1 - last_drag_position.x / 200), camera_speed) * delta
		if last_drag_position.x > viewport_size.x - 200:
			camera_position.x += min(camera_speed * (1 - (viewport_size.x - last_drag_position.x) / 200), camera_speed) * delta
		if last_drag_position.y < 200:
			camera_position.y -= min(camera_speed * (1 - last_drag_position.y / 200), camera_speed) * delta
		if last_drag_position.y > viewport_size.y - 200:
			camera_position.y += min(camera_speed * (1 - (viewport_size.y - last_drag_position.y) / 200), camera_speed) * delta
		camera.global_position = camera_position
		$GhostPlayer.position = global_position
		$GhostPlayer.rotation = lerp_angle($GhostPlayer.rotation, (global_position - last_global_position).angle(), 0.2)
		if $GhostPath.get_point_count() == 0 or ($GhostPath.get_point_position(0) - global_position).length() > 20:
			$GhostPath.add_point(global_position, 0)
		last_global_position = global_position

export var player_click_radius = 50

func _input(event):
	var camera: Camera2D = get_node("/root/Main/Camera")
	# Mouse in viewport coordinates.
	if event is InputEventScreenTouch or (event is InputEventMouseButton and event.button_index == BUTTON_LEFT):
		if event.pressed:
			var global_position = get_viewport().get_canvas_transform().affine_inverse() * event.position
			if (global_position - get_node('/root/Main/Player').position).length() < player_click_radius:
				if !player_dragging:
					player_dragging = true
					$GhostPlayer.show()
					$GhostPlayer.position = global_position
					$GhostPlayer.rotation = get_node('/root/Main/Player').rotation
					$GhostPath.show()
					$GhostPath.clear_points()
					$GhostPath.add_point(get_node('/root/Main/Player').position)
					camera.global_position = global_position
					last_drag_position = event.position
					camera.smoothing_enabled = false
			else:
				get_node('/root/Main/HUD/PowerupMenu').open_menu(event.position)
			get_node("/root/Main/HUD/GhostCover").show()
			get_tree().paused = true

		else:
			if player_dragging:
				player_dragging = false
				$GhostPlayer.hide()
			get_node("/root/Main/HUD/GhostCover").hide()
			get_tree().paused = false
			camera.smoothing_enabled = true

	if player_dragging&&(event is InputEventMouseMotion or event is InputEventScreenDrag):
		last_drag_position = event.position
```

## What did I learn?

I learned a lot about the Godot coordinate system and the concepts of viewports and canvas transforms. Specifically, `get_viewport().get_canvas_transform().affine_inverse() * event.position` converts a mouse event position from screen coordinates to world coordinates. This is useful for figuring out where on the map/in the game the user is pressing.

## Demo

Click [here](/iron-fury/builds/2024-03-28) to play.

Draw a path by pressing and dragging on the green tank. You can also use arrows or WASD on desktop.
