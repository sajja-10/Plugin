# Obsidian Sample Plugin

This is an obsidian plugin.

This project uses Typescript to provide type checking and documentation.
The repo depends on the latest plugin API (obsidian.d.ts) in Typescript Definition format, which contains TSDoc comments describing what it does.

**Note:** The Obsidian API is still in early alpha and is subject to change at any time!

This plugin demonstrates some of the basic functionality the plugin API can do.
- Adds a ribbon icon, which shows a Notice when clicked.
- Adds a command "Open Sample Modal" which opens a Modal.
- Adds a plugin setting tab to the settings page.
- Registers a global click event and output 'click' to the console.
- Registers a global interval which logs 'setInterval' to the console.

This plugin will provide following features:
- Automatically generates Daily, Weekly, Monthly, Quarterly, and Yearly Reviews, along with daily notes from command palette, within a designated folder for each interval.
- The Pomodoro timer can be started, paused, and resumed through the ribbon icon, with the timer displayed in the status bar. You can also stop the timer midway using the command palette and customize your preferred time intervals in the settings.
