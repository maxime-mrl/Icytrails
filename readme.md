# ❄️ Icytrails - community platformer game ❄️
### -------------- WIP --------------
## What is it?
IcyTrails is an open-source and in-browser platformer game with some ✨special✨ functionalities and physics: 
- For the <u>physics</u> part some **inertia** (or slipping on ice) is introduced: the more you move the faster you go and the higher you jump! 💨 and you can't stop immediately you need to slow down. **This allows creatives moves and level design** 💡
- The <u>Specials functionalities</u> are more one special functionality: **levels are created by the community** (just like Mario maker) with a built-in level editor you can change everything  concerning the level like:
  - Blocks placement (*obviously*)
  - Decorations
  - Level length
  - Spawn point
  - End point
  - Checkpoints (you can put as many checkpoints as you want)
  - Coins (for unnecessary  score)
  - Visibility of your level (public or unlisted)

With all these possibilities and the special physics, you can really get creative and create a **unique level**!
## Roadmap:
- [ ] 🖥️ Frontend: 
  - [x] 🔧 Level editor
  - [x] 🕹️ Level player
  - [x] ⚠️ 404 page
  - [x] 🔎 Levels browsing
  - [x] 🏠 Landing page
  - [x] 👤 Profile pages (register / login / edit profile)
  - [x] 🖼️ Logo
- [ ] ⚙️ Backend
  - [x] 🏗️ Database structure
  - [ ] 📜 Database
  - [ ] 👤 User handling
  - [ ] ✔️ Game saving
  - [ ] 🎯 Game selecting
- [ ] ➕ Additionals functionalities?

## How to use it?
If you want to play around with the project, create your levels, share them, etc you can either:
- 🌐 Use the hosted version (🚧 not available yet 🚧)
- Clone the project and run it locally

### How to clone:
**For now:**

You just have to download the project and use some kind of server (apache vs code live server vite etc) not included in the project to host it. You have nothing more to do it'll **magically work** 🥳

To create some levels you need to use the level-editor.html and you'll see for each edit you make there is an object loaded in the console, you need to copy it to a JSON object and change the **fetch URL** in the `game.js` (start of file) file to match your JSON. You can re-edit your level by using the fetch in `editor.js` (end of file) to match your JSON. And, that's it! 🎉

**Later:**

When the backend will be added you'll have to recreate the database but since there is no backend for now let's not get too much ahead 😏