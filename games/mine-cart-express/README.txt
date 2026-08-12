MINE CART EXPRESS — standalone prototype

Open index.html in a browser.

Folder structure:
  index.html
  styles.css
  game.js
  assets/game/
  assets/ui/
  assets/audio/

You can replace visual assets later without changing the code if you keep the same filenames in assets/game/.
The current right-side HUD buttons are CSS placeholders. When the final buttons from Grammar Gold Rush are uploaded, replace them or ask ChatGPT to wire the image assets in.

Important implementation shortcut:
The same background is used for all topics, while the cave labels are HTML overlays. This guarantees that the rail geometry and cart animation never shift between topics.
