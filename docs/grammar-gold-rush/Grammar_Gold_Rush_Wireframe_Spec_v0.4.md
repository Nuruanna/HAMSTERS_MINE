# Grammar Gold Rush — Wireframe Specification

**Document type:** UI / gameplay wireframe specification  
**Project:** educational mini-game website  
**Mini-game:** Grammar Gold Rush  
**Depends on:** `Grammar_Gold_Rush_Game_Spec.md`  
**Version:** 0.4 — synchronized with approved visual assets  
**Status:** implementation baseline

---

# 1. Core Wireframe Decision

Logical game viewport:

- **1280 × 720 px**
- **16:9**
- desktop/laptop first
- no browser scrolling during play
- scale the whole logical scene proportionally to fit the available browser area

Recommended structure:

```text
.game-shell (1280×720 logical)
  sky layer
  movable world layer
  gameplay-object layer
  HUD layer
  modal layer
```

Canvas may be used for the gameplay world, while DOM/HTML is preferred for grammar text, buttons and inputs.

---

# 2. Final Background / World Layer

The mine is **not** built from repeated tunnel-background squares.

## Bottom layer

`sky_background.png`

- fills the entire 1280×720 logical viewport;
- remains fixed during Start → Gameplay transition.

## Movable world layer

`world_background.png`

- full-width 16:9 artwork;
- transparent above the grass;
- grass spans the entire width;
- one one-cell-wide hole is already cut into the grass;
- below the grass is one continuous, evenly textured earth/tunnel background;
- no long vertical shaft is painted into the underground background;
- no large boulders or repeating square tunnel depressions.

The approved manually corrected background is the source of truth for surface/hole placement.

---

# 3. Mine Grid

Final visual baseline:

- **13 columns × 6 rows**
- approximately **98.46 × 98.46 px per cell** at the 1280 px logical width
- board width **1280 px**
- board height approximately **590.77 px**
- approximate board origin: **X=0 / Y=129**

The exact Y and cell size may be adjusted slightly after measuring the final `world_background.png` so that the grass hole aligns perfectly to one grid cell.

## Non-negotiable visual constraints

- six **full** block rows visible;
- no cropped partial seventh row;
- all cells are identical squares;
- no squeezed/narrower blocks in the middle;
- no intra-level camera panning.

---

# 4. Grass Hole / Start Alignment

Do not create or position a separate hole element.

Instead:

1. scale `world_background.png` proportionally to the logical 1280×720 scene;
2. measure the approved grass-hole centre/width in the scaled artwork;
3. set the Level 1 start column so the top grid cell aligns exactly with that baked hole;
4. place the hamster start cell immediately beneath the surface opening.

The background image and grid must always move together as one `worldRoot` during the start transition.

---

# 5. Hamster Scale

Logical occupancy: one grid cell.

Recommended:

- sprite canvas/render box: about **112×112 px**;
- visible hamster body: about **62–70 px tall**.

Important visual rule:

- helmet/head stays below the ceiling of a one-cell tunnel;
- body does not overlap the block above;
- pickaxe may extend outside the cell canvas during a swing.

Collision and interaction use grid coordinates, not sprite bounds.

---

# 6. Gameplay HUD

The HUD is fixed and always above the world layer.

Approximate top zone:

**Y = 8–150**

## Top-left

Two adjacent panels:

### Timer

`timer_panel_bg.png`

Approximate display area:

- X: 20
- Y: 18
- W: 180–210
- H: 70

Overlay code text:

`01:28`

Clock icon is already part of the image.

### Gems

`gems_panel_bg.png`

Approximate display area:

- X: 215–235
- Y: 18
- W: 180–210
- H: 70

Overlay code text:

`14`

Blue diamond icon is already part of the image.

## Top-centre

`logo_grammar_gold_rush.png`

Approximate:

- centred horizontally;
- top 10–20 px;
- width around 330–420 px depending on final art crop.

## Top-right

Four separate image buttons:

1. Music on/off
2. `?`
3. Pause
4. Close / Exit

Suggested logical button size:

**64–72 px square**

Suggested gap:

**8–12 px**

There is no volume slider.

---

# 7. Start Screen Wireframe

The Start Screen uses the same fixed sky as Gameplay.

```text
┌──────────────────────────────────────────────────────────────┐
│                         LOGO                                 │
│                                                              │
│                    [ HAMSTER ]                               │
│                   [  START   ]                               │
│                                                              │
│          [ HOW TO PLAY ]   [ BACK ]                          │
│                                                              │
│                                                              │
│──────────────── grass + baked one-cell hole ────────────────│
└──────────────────────────────────────────────────────────────┘
```

Assets:

- `start_button.png` — includes hamster sitting on top;
- `how_to_play_button.png`;
- `back_button.png`.

The world layer is vertically offset downward so grass is near the bottom and the screen is mostly sky.

Gameplay HUD panels are hidden or faded out on the initial menu. The logo may remain visible.

---

# 8. Topic Select

Use `topic_select_popup.png`.

Suggested logical render bounds:

- X: **260**
- Y: **95**
- W: **760**
- H: **520**

The image supplies:

- title `CHOOSE A TOPIC`;
- frame/decor;
- empty interior.

DOM layer supplies:

- topic cards;
- selected state;
- `LET'S MINE!` button;
- optional close/back hit area if required.

Suggested 2×2 topic-card grid inside the empty panel.

Timer is not running.

---

# 9. Start-to-Mine Transition

After topic confirmation:

1. topic modal fades out;
2. start buttons fade out;
3. `worldRoot` moves upward;
4. fixed sky does not move;
5. the grass line settles below the HUD;
6. the 13×6 mine enters its gameplay position;
7. hamster appears/settles in the start cell under the grass hole;
8. HUD panels fade in;
9. timer begins at `02:00`.

Recommended duration:

**550–700 ms**

No gameplay time is consumed by the transition.

---

# 10. Gameplay Board

Approximate final layout:

```text
┌────────────────────────────────────────────────────────────────────┐
│ [timer][gems]             GRAMMAR GOLD RUSH       [♪][?][Ⅱ][×]  │
│                                                                    │
│────────────── grass / one-cell entrance hole ─────────────────────│
│ ? │ ? │ ? │ R │ S │ G │ O │ H │ R │ ? │ ? │ ? │ ? │ ? │       │
│ ? │ ? │ R │ S │ O │ O │ O │ O │ S │ R │ ? │ ? │ ? │ ? │       │
│ ? │ R │ S │ O │ O │ S │ G │ O │ O │ S │ R │ ? │ ? │ ? │       │
│ ? │ ? │ R │ S │ O │ O │ O │ H*│ S │ G │ R │ R │ ? │ ? │       │
│ ? │ ? │ ? │ R │ S │ O │ O │ S │ O │ O │ E │ R │ ? │ ? │       │
│ ? │ ? │ ? │ ? │ R │ R │ S │ O │ O │ O │ O │ R │ ? │ ? │       │
└────────────────────────────────────────────────────────────────────┘
```

Legend:

- `?` Hidden
- `R` Revealed
- `S` Stone/other block
- `G` Gold Stone
- `O` Open tunnel (background showing through)
- `H` Hamster
- `E` code-rendered exit

The diagram is illustrative only.

---

# 11. Visibility States

## Hidden

- `tile_dark_hidden.png` covers the cell;
- block type is not visible;
- no mining hover.

## Revealed

- hidden tile removed;
- underlying block/chest visible.

## Open / Tunnel

- no tunnel tile is drawn;
- no block is drawn;
- `world_background.png` is visible directly through the empty grid cell.

## Distant explored tunnels

Apply a semi-transparent code-generated dark overlay if desired. Do not replace them with a new image tile.

---

# 12. Cursor States

Only two custom cursor assets:

### Normal

`cursor_default.png`

### Valid mining target

`cursor_pickaxe.png`

Conditions for pickaxe cursor:

- Revealed;
- mineable;
- directly adjacent;
- no modal;
- hamster not action-locked.

### Chest

The unopened chest cell is non-traversable.

Primary interaction is keyboard movement toward an orthogonally adjacent chest:
- player presses the direction key toward the chest;
- hamster stays in the current cell;
- chest event opens.

Mouse click on an adjacent chest may be supported as an alternative.

Keep the normal cursor, but brighten/glow the chest on hover. No third hand cursor asset.

---

# 13. Movement Timing

Movement is discrete by cell but visually interpolated.

Baseline:

- **150 ms per cell**

One key press = one cell.

Held-key repeat may use:

- initial delay ~180 ms;
- repeat ~150 ms.

No diagonal movement.

---

# 14. Hamster Animation

States:

- idle
- walk
- climb
- mine-side
- mine-up
- mine-down

Base side direction = right.

Left = horizontal mirror.

Suggested walk/climb frame count: about **4**.

Mining swing baseline: about **280 ms**.

Damage applies at the impact frame (~55% through the swing), not at mouse-down.

---

# 15. Block Damage UI

Blocks fill the cell square.

Use the same base block asset plus transparent crack overlay.

### Stone / Gold Stone

3 hits:

- after hit 1 → crack overlay 1
- after hit 2 → stronger crack overlay
- hit 3 → break

### Hard Rock

5 hits:

- map overlays 1–5 to increasing damage;
- break after hit 5.

At each impact show a short `debris_dirt_particles.png` particle effect.

---

# 16. Standard Grammar Challenge

Use `popup_grammar_bg.png` as the background image.

Suggested logical display:

- X: **140**
- Y: **90**
- W: **1000**
- H: **560**

Background game receives a dark modal overlay.

The popup image already contains:

- `GRAMMAR CHALLENGE` title;
- decorative frame;
- timer badge/frame **without digits**;
- empty content area.

DOM overlay inside the panel contains:

- sentence/question;
- timer number `10` → `0`;
- three real answer buttons.

Suggested answer button size:

- width 620–700
- height 50–58
- vertical gap 10–14

Buttons support CSS states:

- hover
- pressed
- disabled
- correct
- wrong

No answer-button image assets are used.

There is **no close X** on Grammar Challenge. It ends only by answer or 10-second timeout.

---

# 17. Hard Rock Typed Challenge

Uses the **same** `popup_grammar_bg.png`.

DOM content changes to:

- bracket/gap prompt;
- text input;
- CHECK button;
- Enter submits.

Input auto-focuses.

The fixed popup title remains `GRAMMAR CHALLENGE` in v1.

---

# 18. Reward Reveal and Physical Pickup

Hidden reward images are centred in the mined cell after a correct answer.

Mapping:

- +1 → `gem_blue.png`
- +2 → `gem_green_red.png`
- +3 → `gem_purple_pink_yellow.png`
- +7 → `lucky7_reward.png`

### Reveal state

Suggested reveal animation:

- 0–120 ms: scale 0.7 → 1.05
- 120–350 ms: sparkle/settle
- after 350 ms: reward remains visibly resting in that open cell

Do **not** fly the reward to the HUD at reveal time.

If wrong/timeout, nothing is revealed.

### Pickup state

The reward stays on the map until the hamster enters the same cell.

On cell entry:

1. pickup sound;
2. reward quickly pops/shrinks/disappears;
3. floating code-rendered text rises from the cell (`+1`, `+2`, `+3`, or `LUCKY 7! +7`);
4. HUD Gem counter increments;
5. Gem panel pulses briefly.

Suggested pickup effect:

- 0–100 ms: reward scale 1.0 → 1.15
- 100–250 ms: reward scale 1.15 → 0 / fade
- 0–450 ms: `+N` text rises 25–40 px and fades
- HUD pulse: ~250–350 ms

No click is required to collect Gems.

---

# 19. Treasure Popup

Use `popup_treasure_bg.png`.

Suggested logical display:

- X: **350**
- Y: **140**
- W: **580**
- H: **440**

The art already contains the large open treasure chest.

No map chest-opening animation is played.

When opened:
- apply +3 Gems once;
- pulse the HUD Gem counter;
- keep the global timer paused;
- show a code-rendered close X in the popup corner.

After X closes the popup:
- remove the consumed chest from the map;
- turn its cell into an Open tunnel cell;
- resume gameplay and the global timer.

---

# 20. Ghost Challenge Popup

Use `popup_ghost_bg.png`.

This is the widest gameplay popup.

Suggested logical bounds:

- X: **90**
- Y: **105**
- W: **1100**
- H: **520**

### Left illustration zone

Approximately 42–45% of popup width:

- open empty chest;
- angry Ghost flying out.

### Right challenge zone

Approximately 55–58%:

- 5-second code timer;
- question;
- two HTML/CSS answer buttons.

Timer frame is baked into the popup without digits.

There is **no close X** on the Ghost Challenge. It ends only by answer or 5-second timeout.

---

# 21. Ghost Outcome Popups

## Ghost stole

`popup_ghost_stole_bg.png`

Suggested display:

- centred;
- W: 560–620
- H: 340–390

Baked content:

- happy Ghost carrying two diamonds;
- text `O, no! The ghost stole 2 diamonds!`.

Gameplay effect: −2 score, minimum 0.

Add a code-rendered close X. The chest is removed and gameplay resumes only after this result popup closes.

## Ghost defeated

`popup_ghost_defeated_bg.png`

Suggested display:

- centred;
- W: 560–620
- H: 340–390

Baked content:

- defeated Ghost;
- `Ghost defeated!`;
- +2 and two coloured Gems.

Gameplay effect: +2 score.

Add a code-rendered close X. The chest is removed and gameplay resumes only after this result popup closes.

The result remains until the player closes it with the code-rendered X.

An optional minimum visibility lock of ~400–600 ms may prevent accidental immediate dismissal.

---

# 22. How to Play Popup

Use `popup_how_to_play_bg.png`.

Suggested logical bounds:

- X: **210**
- Y: **75**
- W: **860**
- H: **570**

The art supplies the title/frame. Instruction text is HTML so it remains editable.

Add the universal code-rendered close X.

---

# 22A. Unified Modal and Close Behaviour

All modal windows sit above a dark overlay and block the game world.

While a gameplay modal is open:
- no movement;
- no mining;
- no chest activation;
- no Gem pickup;
- global 2-minute timer paused.

Local challenge timers continue:
- Grammar: 10 s;
- Ghost: 5 s.

### Close X matrix

| Modal | X |
|---|---:|
| Topic Select | yes |
| How to Play | yes |
| Grammar Challenge | **no** |
| Treasure | yes |
| Ghost Challenge | **no** |
| Ghost stole | yes |
| Ghost defeated | yes |
| Results | **no** |

The close X is a real HTML/CSS control layered over the popup, not a required graphics asset.

For challenge windows, clicking the dark backdrop and pressing Escape must not dismiss the challenge.

For informational windows, X closes the modal after the event state has been committed.

---

# 23. Level Exit

No dedicated PNG is required.

When the hidden exit becomes Revealed:

- keep the underlying cell Open;
- darken its centre;
- draw a code-generated downward arrow and/or `GO DEEPER` label;
- optionally pulse opacity.

The hamster moves onto the special cell and transition begins automatically.

The exit should appear in the lower half of Levels 1 and 2.

---

# 24. Level Transition

On entering the exit:

1. input lock;
2. global timer pause;
3. code overlay:
   - `LEVEL 1 COMPLETE!`
   - `Going deeper...`
4. grid/world content scrolls upward;
5. next generated mine replaces/enters the board;
6. hamster starts near top;
7. brief new-level title appears;
8. timer resumes.

Baseline duration:

**900–1200 ms**

The fixed HUD remains stationary.

---

# 25. Results Popup

Use `popup_results_bg.png`.

This is a tall/vertical panel.

Suggested logical display:

- X: **365**
- Y: **20–35**
- W: **550**
- H: **665–680**

Artwork contains:

- blue ribbon `Level completed`;
- treasure chest full of Gems;
- empty statistics field;
- baked `Play again` button;
- baked red `Back to camp` button.

DOM text inside empty area:

```text
GEMS COLLECTED      27
BLOCKS MINED        34
GRAMMAR             9 / 11
GHOSTS DEFEATED     2
DEEPEST LEVEL       3
```

Because buttons are baked into one image, add transparent hit areas over their exact locations.

Results has **no close X**. The player must choose `Play again` or `Back to camp`.

Hover may be represented with a code-generated glow/outline over the relevant button rectangle.

---

# 26. Z-Layer Order

Recommended order:

1. `sky_background`
2. `world_background`
3. hidden reward objects
4. blocks / closed chest / code-rendered exit
5. hidden-cell/fog overlays
6. hamster
7. cracks / debris / reward effects
8. fixed HUD
9. modal backdrop
10. modal artwork
11. modal HTML content / timers / interactive controls

Important: Open cells do not receive a tunnel-image layer.

---

# 27. Canvas vs DOM Split

## Canvas / gameplay layer

Recommended for:

- world movement;
- grid cells;
- blocks;
- hidden overlays;
- hamster sprites;
- cracks;
- debris;
- reward reveal-on-cell state;
- physical reward pickup animation + floating `+N`;
- level transition.

## DOM / HTML overlay

Recommended for:

- start buttons if easiest as `<button><img>` elements;
- topic cards;
- grammar questions;
- multiple-choice buttons;
- typed input;
- question timer digits;
- How to Play text;
- HUD numeric text;
- result statistics;
- transparent hit regions over baked result buttons.

---

# 28. Responsive Behaviour

The whole 1280×720 logical scene scales proportionally.

No independent reflow of the mine grid.

Examples:

- 1280×720 → 1.0×
- 1920×1080 → 1.5×
- 1366×768 → fit by the smaller proportional scale and centre the game shell.

Do not stretch X and Y independently because the baked grass hole must remain aligned with the square grid.

---

# 29. Prototype UI States

```text
START_SCREEN
TOPIC_SELECT
START_TRANSITION
PLAYING
GRAMMAR_MODAL
HARD_GRAMMAR_MODAL
TREASURE_POPUP
GHOST_CHALLENGE
GHOST_STOLE_POPUP
GHOST_DEFEATED_POPUP
LEVEL_TRANSITION
RESULTS
PAUSED
HOW_TO_PLAY
```

Only one blocking modal/event state may be active at once.

---

# 30. Fixed Wireframe Decisions

- logical viewport 1280×720;
- 16:9;
- fixed 13×6 mine grid;
- exactly six full visible block rows;
- square cells only;
- no intra-level camera scrolling;
- fixed sky background;
- one continuous movable world-background image;
- no repeated tunnel tile;
- grass hole baked into world image;
- grid aligned to the baked hole;
- timer + Gems top-left;
- logo top-centre;
- music/help/pause/close top-right;
- no level panel in persistent HUD;
- no volume slider;
- hamster body comfortably under one-cell ceiling;
- two cursor states only;
- crack overlays rather than damaged-block replacements;
- Grammar and Hard Rock use one popup background;
- grammar answer controls are HTML/CSS;
- chest opening happens in popup, not on map;
- unopened chest cell blocks movement;
- moving toward an adjacent chest activates it;
- consumed chest disappears only after the popup flow closes;
- revealed Gems stay on the map until hamster enters their cell;
- pickup triggers sound, floating `+N`, score increment and HUD pulse;
- Ghost event has one wide challenge popup plus two outcome popups;
- all gameplay modals pause the global timer and block world input;
- informational modals use one code-rendered close X;
- Grammar/Ghost challenge modals have no X;
- level exit can be code-rendered;
- Results uses one vertical image with two baked buttons and HTML hit zones;
- all gameplay text that changes is rendered in code whenever possible.

---

# 31. Values Still Open to Playtesting

- exact 88 px cell baseline after background measurement;
- exact world start Y offset;
- exact gameplay world Y position;
- 150 ms movement speed;
- 280 ms mining swing;
- fog dim opacity;
- reveal radius/pattern beyond immediate neighbours if tested;
- modal minimum-visible durations;
- exact topic-card layout;
- reward reveal/pickup animation duration;
- floating `+N` placement and HUD-pulse strength;
- level-exit visual pulse;
- optional Level 2/3 colour tint.

---

# 32. Implementation Hand-off Rule

For Codex/Visual Studio, this wireframe and `Grammar_Gold_Rush_Game_Spec.md` are the source of truth.

If an older mockup or generated image conflicts with these documents:

1. use the approved canonical assets;
2. follow the current layer architecture;
3. do not recreate deprecated tunnel/grass assets;
4. do not infer new UI elements that are not listed here.
