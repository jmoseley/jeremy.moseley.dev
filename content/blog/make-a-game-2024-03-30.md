---
title: "Journal: A CRUD developer builds a game"
date: 2024-03-30
tags:
  - game development
  - godot
  - camera
  - level
---

## What did I do today?

Just a quick update to fix the scrolling behavior so it works properly. This took some poking to realize that I needed to use `get_viewport_rect()` to get the viewport size, and this would work when checking `event.position` against the edges of the screen for input events.

[Check it out](/iron-fury/builds/2024-03-30).

Here is the updated code:

```gdscript
var player_dragging = false
var camera_speed = 700
var last_drag_position = Vector2()
var viewport_size = Vector2()

var cover: ColorRect

func _ready():
	player_click_radius = 50
	cover = get_node("/root/Main/HUD/GhostCover")
	cover.hide()
	$GhostPlayer.hide()
	get_node('/root/Main/HUD/PowerupMenu').hide()
	get_node('/root/Main/HUD/PowerupMenu').set_items([
		{'texture': AIRSTRIKE_TEXTURE, 'title': 'Air Strike', 'id': 'air_strike'},
	])
	get_node('/root/Main/HUD/PowerupMenu').pause_mode = Node.PAUSE_MODE_PROCESS
	pause_mode = Node.PAUSE_MODE_PROCESS
	viewport_size = get_viewport_rect().size

var camera_scroll_edge_size = 0.2 # 20% of the screen size

func _process(delta):
	# move the camera if the player is dragging and near the edges of the screen
	if player_dragging:
		var camera: Camera2D = get_node("/root/Main/Camera")
		var global_position = get_viewport().get_canvas_transform().affine_inverse() * last_drag_position
		var camera_position = camera.global_position
		if last_drag_position.x < viewport_size.x * camera_scroll_edge_size:
			# faster speed when closer to the edge
			camera_position.x -= clamp(camera_speed * (1 - last_drag_position.x / (viewport_size.x * camera_scroll_edge_size)), 0, camera_speed) * delta
		if last_drag_position.x > viewport_size.x * (1 - camera_scroll_edge_size):
			camera_position.x += clamp(camera_speed * (1 - (viewport_size.x - last_drag_position.x) / (viewport_size.x * camera_scroll_edge_size)), 0, camera_speed) * delta
		if last_drag_position.y < viewport_size.y * camera_scroll_edge_size:
			camera_position.y -= clamp(camera_speed * (1 - last_drag_position.y / (viewport_size.y * camera_scroll_edge_size)), 0, camera_speed) * delta
		if last_drag_position.y > viewport_size.y * (1 - camera_scroll_edge_size):
			camera_position.y += clamp(camera_speed * (1 - (viewport_size.y - last_drag_position.y) / (viewport_size.y * camera_scroll_edge_size)), 0, camera_speed) * delta
		camera.global_position = camera_position
		$GhostPlayer.position = global_position
		$GhostPlayer.rotation = lerp_angle($GhostPlayer.rotation, (global_position - $GhostPath.get_point_position(0)).angle(), 0.2)
		if $GhostPath.get_point_count() == 0 or ($GhostPath.get_point_position(0) - global_position).length() > 20:
			$GhostPath.add_point(global_position, 0)

export var player_click_radius = 50

func _input(event):
	var camera: Camera2D = get_node("/root/Main/Camera")
	# Mouse in viewport coordinates.
	if event is InputEventScreenTouch or (event is InputEventMouseButton and event.button_index == BUTTON_LEFT):
		if event.position.x < 0 or event.position.y < 0 or event.position.x > viewport_size.x or event.position.y > viewport_size.y:
			return
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
					camera.smoothing_enabled = false
					last_drag_position = event.position
					cover.show()
					get_tree().paused = true
			else:
				get_node('/root/Main/HUD/PowerupMenu').open_menu(event.position)
				cover.show()
				get_tree().paused = true

		else:
			if player_dragging:
				player_dragging = false
				$GhostPlayer.hide()
			get_node("/root/Main/HUD/GhostCover").hide()
			get_tree().paused = false
			camera.smoothing_enabled = true

	if event is InputEventScreenDrag:
		if player_dragging:
			print("update Dragging player", event.position)
			last_drag_position = event.position
```

## Demo

Click [here](/iron-fury/builds/2024-03-30) to play.

Draw a path by pressing and dragging on the green tank. You can also use arrows or WASD on desktop.
