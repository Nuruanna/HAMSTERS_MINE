# Grammar Gold Rush — Game Specification

**Document type:** gameplay / implementation specification  
**Project:** educational mini-game website  
**Mini-game:** Grammar Gold Rush  
**Platform:** browser; static deployment compatible with GitHub Pages  
**Core technology target:** HTML / CSS / JavaScript  
**Version:** 0.4 — consolidated mechanics + final visual architecture  
**Status:** approved baseline for implementation

---

## 1. Game Concept

**Grammar Gold Rush** is a timed educational mining game. The player controls a hamster miner who explores a dark mine, breaks blocks, completes English grammar challenges, finds hidden Gems, opens treasure chests and tries to reach deeper levels before the global timer expires.

The game should feel like a real arcade/exploration mini-game first. Grammar is embedded into the mining loop rather than presented as a separate worksheet.

### Core loop

1. Move through already opened tunnel cells.
2. Reveal nearby hidden cells.
3. Choose an adjacent block to mine.
4. Hit the block until it breaks.
5. Complete a grammar challenge when required.
6. Reveal the hidden reward if the answer is correct.
7. Collect Gems, open chests and search for the descent to the next level.
8. Continue until the 2-minute global timer ends.

---

## 2. Session Structure

A session uses:

- **one selected grammar topic**;
- **one global timer: 2:00**;
- **up to three mine levels**;
- **one continuous Gem score**;
- **one continuous statistics record**.

The timer does **not** reset between levels.

### Session flow

`Start Screen → Choose a Topic → Start Transition → Level 1 → Level 2 → Level 3 → Results`

The player may finish while still on Level 1 or Level 2 if time expires.

---

## 3. Final Visual Architecture

This section supersedes the earlier idea of assembling the mine from separate grass strips and repeated tunnel-background tiles.

### 3.1 Fixed layer model

From bottom to top:

1. **`sky_background.png`** — one continuous sky used on both Start Screen and Gameplay.
2. **`world_background.png`** — one full-width world image containing:
   - grass across the whole width;
   - one correctly aligned one-cell-wide hole in the grass;
   - continuous, even underground earth/tunnel background below the grass;
   - occasional subtle pebbles only;
   - transparent area above the grass so the sky remains visible.
3. Hidden reward objects for cells that contain a reward; invisible while the covering block exists.
4. Mine grid objects: blocks and closed chests.
5. Fog-of-war / hidden-cell overlays.
6. Hamster sprite.
7. Crack overlays, flying debris, Gem reveal effects and floating feedback.
8. Fixed HUD.
9. Modal backdrop.
10. Modal artwork + HTML/CSS question content.

### 3.2 Important background rule

There is **no repeated tunnel tile** in the final architecture.

An excavated/open cell is rendered by simply removing its block/fog layer so the continuous `world_background.png` underneath becomes visible.

This avoids seams, repeated square depressions and mismatched tunnel texture.

### 3.3 Start-screen transition

The sky is fixed. The world is a movable layer.

At the Start Screen:

- `sky_background.png` fills the logical viewport;
- `world_background.png` is positioned lower so the screen is mostly sky and the grass sits near the bottom;
- start-menu assets float above the sky.

After topic confirmation:

- the menu fades out;
- the world layer, including the generated mine objects and hamster, moves upward as one unit;
- the grass line settles directly below the fixed HUD zone;
- the mine fills the rest of the screen;
- the timer begins only after the transition is complete.

### 3.4 Grid alignment to the background

The grass hole is already part of `world_background.png` and is the visual source of truth.

Implementation must align the grid so that:

- the hole width equals exactly one logical cell;
- the hole centre aligns with the Level 1 start/shaft column;
- the first grid row starts directly beneath the grass surface;
- the background is scaled proportionally, never stretched non-uniformly.

Do **not** position a separate hole image in code.

---

## 4. Logical Viewport and Mine Grid

### Logical viewport

- **1280 × 720**
- **16:9**
- desktop/laptop first
- entire game scales proportionally to the browser window
- no browser scrolling during play

### Final visual grid baseline

The approved visual direction shows **six complete block rows** with no cropped partial row at the bottom.

Prototype baseline:

- **13 columns × 6 rows**
- approximately **98.46 × 98.46 logical px per cell** at the 1280 px logical width
- board width **1280 px**
- board height approximately **590.77 px**
- board origin approximately **X=0, Y=129**

A few pixels may be adjusted during implementation to match the approved background asset exactly. The six-full-row rule is more important than preserving a particular pixel number.

### Grid interaction

Adjacency is orthogonal only:

- up
- down
- left
- right

No diagonal movement or mining.

---

## 5. Start Screen

The start screen is built from reusable assets rather than one flattened screenshot.

Visible elements:

- continuous sky background;
- the top-centre Grammar Gold Rush logo;
- `start_button.png` — large floating START button, with the approved hamster already integrated into the artwork;
- `how_to_play_button.png` — smaller button below START;
- `back_button.png` — smaller button below/alongside How to Play;
- the world-background layer lower in the scene, with grass near the bottom.

The main gameplay timer is not running.

### Start interaction

Clicking START opens the topic-selection modal. It does **not** start the 2-minute timer.

---

## 6. Choose a Topic

Use **`topic_select_popup.png`** as the popup artwork.

The artwork contains:

- fixed title / frame / decorative elements;
- empty interior space.

The following are generated in HTML/CSS:

- topic cards/buttons;
- selected state;
- optional short description;
- confirmation button `LET'S MINE!`.

Example topics:

- Present Simple
- Present Continuous
- Past Simple
- Future Forms

The game engine must not be hard-coded to one topic.

After confirmation, the popup closes and the start-to-mine transition runs. The global timer starts after that transition ends.

---

## 7. Fixed HUD

The HUD is pinned to the screen and does not move during world transitions.

### Top-left

1. **`timer_panel_bg.png`** — clock icon is already merged into the asset; only `MM:SS` is overlaid in code.
2. **`gems_panel_bg.png`** — blue diamond icon is already merged into the asset; only the numeric score is overlaid in code.

### Top-centre

- **`logo_grammar_gold_rush.png`**

### Top-right

Four separate clickable assets:

- `button_music_on.png`
- `button_music_off.png`
- `button_help.png`
- `button_pause.png`
- `button_close.png`

Only one music-state asset is visible at a time.

There is **no volume slider** in v1.

### Level labels

A persistent Level panel is not required in the approved HUD. Level names may appear as short code-rendered transition labels, e.g. `LEVEL 2 — DEEP MINE`.

---

## 8. Global Timer

Game duration: **2 minutes**.

Display: `02:00`.

### Timer runs during

- movement;
- route planning;
- mining animations;
- travel through opened tunnels.

### Timer pauses during

- standard multiple-choice grammar challenge;
- typed Hard Rock grammar challenge;
- Ghost Challenge;
- blocking chest-result popup;
- level transition.

### Timer expiry

When the global timer reaches zero:

- normal input is disabled;
- no new mining action begins;
- the session ends after any already-open paused challenge resolves;
- the Results popup is shown.

---

## 9. Visibility / Fog of War

Each grid cell has one of three visibility states.

### Hidden

- covered by `tile_dark_hidden.png` or an equivalent dark cell overlay;
- block type is not visible;
- not mineable.

### Revealed

- the hidden overlay is removed;
- block/chest type becomes visible;
- a mineable adjacent block can be targeted.

### Open / Tunnel

- no block image is rendered;
- the continuous `world_background.png` shows through;
- the hamster can move through the cell.

### Reveal rule

Opening a cell reveals directly orthogonal neighbouring hidden cells.

Previously explored cells never return to full darkness. Distant explored tunnel areas may receive a translucent dim overlay generated in code.

---

## 10. Hamster Movement

Controls:

- Arrow keys
- WASD

Movement is one orthogonal grid cell at a time.

The hamster may move only onto Open/tunnel cells and special traversable cells such as the level exit.

### Scale rule

The visible hamster body must be comfortably shorter than the height of one block/tunnel cell so the helmet remains below the ceiling.

Recommended baseline for an ~88 px cell:

- visible hamster body: approximately **62–70 px tall**;
- sprite canvas/render box: approximately **112 × 112 px** to allow pickaxe swing.

Collision uses grid coordinates, never sprite artwork bounds.

---

## 11. Cursor Behaviour

Only two cursor assets are required.

### `cursor_default.png`

Used for:

- normal screen interaction;
- non-mineable cells;
- UI unless a normal browser pointer is preferred.

### `cursor_pickaxe.png`

Shown only when the pointer is over a valid mine target:

- cell is Revealed;
- cell is mineable;
- cell is directly adjacent to hamster;
- no blocking modal is open;
- hamster is not action-locked.

### Chests

Use the default cursor plus a subtle hover glow/brightness on the chest. No third cursor asset is needed.

---

## 12. Block Types

| Block | Hits | Grammar | Reward behaviour |
|---|---:|---|---|
| Dirt | 1 | none | no normal hidden Gem reward in v1 |
| Stone | 3 | multiple choice | normal reward table |
| Gold Stone | 3 | multiple choice | better reward table |
| Hard Rock | 5 | typed grammar form | normal/configurable reward table |

Canonical artwork:

- `block_dirt.png`
- `block_stone.png`
- `block_hard_rock.png`
- `block_gold_ore.png`

Each block type uses one consistent tile image throughout the map.

---

## 13. Block Damage and Impact Effects

Damage is not represented by separate full block images.

Use transparent overlays:

- `crack_overlay_1.png`
- `crack_overlay_2.png`
- `crack_overlay_3.png`
- `crack_overlay_4.png`
- `crack_overlay_5.png`

The overlay shown depends on the number of completed hits.

### Impact timing

Mining animation sequence:

`lift → swing → impact → recovery`

Block HP changes on the **impact frame**, not at mouse-down.

At impact, briefly show:

- **`debris_dirt_particles.png`** — flying dirt/rock pieces and dust.

The same debris asset is sufficient for v1. Optional code tinting/brightness variation may be used for stone-heavy blocks.

---

## 14. Grammar Challenge Architecture

### Shared popup asset

Both standard Stone/Gold Stone challenges and typed Hard Rock challenges use:

- **`popup_grammar_bg.png`**

The artwork contains:

- the approved `GRAMMAR CHALLENGE` frame/title;
- decorative mining elements;
- a timer frame with **no number**;
- a large empty content area.

The following are rendered by HTML/CSS:

- question text;
- question timer number;
- multiple-choice buttons;
- typed input;
- CHECK/submit button where needed;
- correct/wrong states.

### Standard challenge

- timer: **10 seconds**;
- three answer buttons;
- buttons are real HTML/CSS controls so hover, pressed, correct, wrong and disabled states can be animated.

### Hard Rock challenge

Use a controlled typed-form prompt, e.g.:

`My parents ___ (not/work) on Sundays.`

Do not require unrestricted sentence composition in v1.

Typed checking initially normalises:

- letter case;
- leading/trailing spaces;
- repeated spaces.

Accepted alternatives may be explicitly configured.

### Challenge result

Correct:

- if the cell contains a hidden reward, the reward is **revealed and left on the open cell**;
- the reward is **not added to the score yet**;
- block cell becomes Open;
- neighbours reveal.

Wrong/timeout:

- the hidden reward is lost permanently;
- no reward graphic appears;
- block cell still becomes Open;
- neighbours still reveal.

The player can never get stuck because of a wrong grammar answer.

---

## 15. Hidden Rewards and Reward Assets

Normal block outcomes are assigned when the level is generated.

Possible outcomes:

- empty;
- +1 Gem;
- +2 Gems;
- +3 Gems.

### Canonical reward-art mapping

- **+1** → `gem_blue.png`
- **+2** → `gem_green_red.png`
- **+3** → `gem_purple_pink_yellow.png`
- **+7** → `lucky7_reward.png`

Reward images are logically hidden under the block. They become visible only after the block is destroyed **and** the required grammar answer is correct.

### Important: rewards are collected physically

A revealed reward does **not** immediately increase the Gem counter.

After a correct answer:

1. block disappears;
2. the reward asset appears centred in the now-open cell;
3. the cell remains traversable;
4. the reward stays on the map until the hamster enters that exact cell.

When the hamster moves onto a cell containing a revealed reward:

1. play a short pickup sound;
2. remove/shrink the reward graphic with a quick sparkle/pop effect;
3. emit floating text from that cell:
   - `+1`
   - `+2`
   - `+3`
   - or `+7` / `LUCKY 7! +7`;
4. increment the HUD Gem counter at that moment;
5. briefly pulse/highlight `gems_panel_bg.png`;
6. mark the reward `collected` so it cannot be collected twice.

No mouse click on the reward is required. Walking onto the cell automatically collects it.

A reward may remain on the map while the player explores elsewhere. If the session ends before the hamster reaches it, it remains uncollected and is not added to the final Gem score.

If the grammar answer is wrong or times out, no reward image appears and the reward is lost permanently.

### Preliminary probabilities

#### Stone

- empty 60%
- +1 20%
- +2 15%
- +3 5%

#### Gold Stone

- empty 25%
- +1 25%
- +2 30%
- +3 20%

All values are configuration, not hard-coded constants.

---

## 16. Lucky 7

Each level contains exactly one preassigned Lucky 7 reward in an eligible reward block.

Reward:

**+7 Gems**

Artwork:

- `lucky7_reward.png` — a pile of multicoloured Gems with sparkling `Lucky 7` text.

The player may or may not find it.

After a correct grammar answer, Lucky 7 remains visible in the open cell until the hamster physically enters that cell.

On pickup:

- play a distinctive celebratory pickup sound;
- remove the reward from the map;
- emit a short non-blocking `LUCKY 7! +7` effect from the cell;
- add 7 Gems;
- give the HUD Gem counter a stronger pulse than a normal pickup.

No separate modal is used for Lucky 7.

---

## 17. Chests

Chests are separate map cells, not hidden under normal blocks.

Map artwork:

- **`chest_closed_tile.png`**

A chest becomes visible when its cell is Revealed.

### Chest cell behaviour

While unopened, a chest cell is **not traversable**.

Primary interaction:

1. hamster stands orthogonally adjacent to the chest;
2. the player presses the movement key toward the chest cell;
3. instead of moving into the cell, the chest event is triggered.

Optional accessibility/desktop alternative:

- clicking the adjacent chest may trigger the same interaction;
- this uses the normal cursor with a subtle hover glow;
- no third cursor asset is needed.

### Trigger sequence

At the instant a chest is triggered:

- play a short chest/event sound;
- lock world input;
- pause the 2-minute global timer;
- mark the chest `consumed` immediately so repeated input cannot trigger it twice;
- keep the hamster in the adjacent cell;
- open either Treasure or Haunted Chest flow.

There is **no chest-opening animation on the map** in v1.

The closed chest graphic remains irrelevant while the modal is active. After the chest event is fully resolved and its final informational popup is closed:

- remove `chest_closed_tile.png` from the map;
- convert the chest cell to a normal Open tunnel cell;
- resume world input and the global timer;
- the hamster may enter that cell on a subsequent movement command.

---

## 18. Treasure Chest Outcome

Treasure outcome uses:

- **`popup_treasure_bg.png`**

The artwork contains a large open chest full of Gems.

Base reward:

**+3 Gems**

No grammar question.

When the Treasure popup opens:

- apply the +3 Gems once;
- update/pulse the HUD Gem counter;
- keep the global timer paused.

The popup is informational and may be closed by the universal code-rendered modal close button.

After it closes:

- the consumed chest disappears from the map;
- its cell becomes Open;
- gameplay resumes.

---

## 19. Haunted Chest / Ghost Challenge

### Main ghost popup

Use:

- **`popup_ghost_bg.png`**

The window is wider than the standard grammar popup.

Fixed art:

- title `A ghost!`;
- timer frame without digits;
- left side: open empty chest with an angry Ghost flying out;
- right side: large empty challenge area.

Code-rendered content on the right:

- 5-second timer;
- question;
- two answer buttons.

Example:

A. `She don't like spiders.`  
B. `She doesn't like spiders.`

The Ghost Challenge is a mandatory challenge and has **no close button**.

### Correct

Apply immediately:

- +2 Gems;
- increment `ghostsDefeated`.

Then show:

- **`popup_ghost_defeated_bg.png`**

The artwork contains:

- defeated Ghost;
- `Ghost defeated!`;
- `+2` and two coloured Gems.

This is an informational result popup. It has the universal code-rendered close button.

### Wrong / timeout

Apply immediately:

- subtract 2 Gems;
- score floor = 0.

Then show:

- **`popup_ghost_stole_bg.png`**

The artwork contains:

- happy Ghost carrying two diamonds;
- fixed text `O, no! The ghost stole 2 diamonds!`.

This is an informational result popup. It has the universal code-rendered close button.

After either Ghost outcome popup is closed:

- remove the consumed chest from the map;
- convert its cell to Open;
- resume world input and the global timer.

No separate Ghost sprite animation is required on the map.

---

## 20. Level System

Three sequential levels share the same selected grammar topic.

### Level 1 — Upper Mine

- more Dirt and Stone;
- little Hard Rock;
- fewer chests.

### Level 2 — Deep Mine

- less Dirt;
- more Gold Stone and Hard Rock;
- more chests.

### Level 3 — Haunted Depths

- most Hard Rock / Gold Stone;
- most chests;
- highest Haunted Chest exposure.

### Educational rule

Grammar difficulty does **not** increase by depth.

The deeper levels become mechanically harder through geology and event frequency, not harder English.

### Background rule for v1

All three levels may reuse the same approved `world_background.png`.

Depth differences can be created with:

- block distribution;
- stronger fog/dimming;
- chest frequency;
- optional code-generated colour overlay.

No additional background assets are required for v1.

---

## 21. Level Exit / Going Deeper

Level 1 and Level 2 contain one hidden descent in the lower half of the grid.

The player does not need to clear the map.

### v1 visual implementation

No dedicated exit PNG is required.

Render the exit in code as a special Open cell with:

- locally darkened shaft/opening;
- animated downward arrow and/or `GO DEEPER` text;
- clear hover/activation cue.

This keeps the current asset set complete without adding another illustration.

### Placement rules

- lower half of the map;
- not always directly below the start;
- map generator guarantees a reasonable route;
- best practical path should avoid excessive Hard Rock.

Entering the exit triggers the next-level transition automatically.

---

## 22. Level Transition

When the hamster enters the exit:

1. input locks;
2. global timer pauses;
3. code overlay appears, e.g. `LEVEL 1 COMPLETE!` / `Going deeper...`;
4. current world/grid layer moves upward;
5. next generated level replaces/enters the play area;
6. hamster is placed on its start cell;
7. short level title appears;
8. timer resumes.

Recommended total transition: approximately **900–1200 ms**.

---

## 23. Hamster Animation System

Canonical animation assets:

- `hamster_idle_right.png`
- `hamster_walk_right_sheet.png`
- `hamster_climb_sheet.png`
- `hamster_mine_side_sheet.png`
- `hamster_mine_up_sheet.png`
- `hamster_mine_down_sheet.png`

### Direction

The base horizontal artwork faces right.

Left movement/mining uses horizontal sprite mirroring in code. No duplicate left-facing sheets are required.

### Suggested states

- idle: 2–3 frames or static/short loop;
- walk: ~4 frames;
- climb: ~4 frames;
- mining: 3–4 frames.

### Input locking

During a short mining swing:

- movement is blocked;
- new mining clicks are ignored;
- HP changes only at impact.

---

## 23A. Unified Modal / Pause Rules

Every popup/modal blocks interaction with the mine world.

While a gameplay modal is open:

- hamster movement is disabled;
- mining is disabled;
- chest/reward interaction is disabled;
- the 2-minute global timer is paused;
- background world remains visible under a dark modal overlay.

Challenge popups have their own local timers which continue while the global timer is paused:

- Grammar Challenge: 10 seconds;
- Ghost Challenge: 5 seconds.

### Close-button policy

The actual close control is an **HTML/CSS button rendered by code**, not a required standalone image asset.

| Popup | Global game state | Code close X | How it ends |
|---|---|---|---|
| `topic_select_popup.png` | game not started | yes | X returns to Start; topic confirmation starts transition |
| `popup_how_to_play_bg.png` | paused if opened during play | yes | X |
| `popup_grammar_bg.png` | paused | **no** | answer or 10-second timeout |
| `popup_treasure_bg.png` | paused | yes | X |
| `popup_ghost_bg.png` | paused | **no** | answer or 5-second timeout |
| `popup_ghost_stole_bg.png` | paused | yes | X |
| `popup_ghost_defeated_bg.png` | paused | yes | X |
| `popup_results_bg.png` | session ended | **no** | Play again / Back to camp |

Mandatory challenge popups must never be dismissible with Escape, clicking outside the modal, or a hidden close target.

Informational popups may optionally also support Escape, but the visible X remains the standard close affordance.

If an approved PNG already contains a decorative/baked X:

- overlay the real HTML/CSS hit target on that location for closable informational popups;
- for mandatory challenge popups, do not make a baked X interactive; if necessary, visually cover/mask it so the user is not invited to bypass the challenge.

When a closable popup is dismissed, resume the global timer only after all event-resolution work for that popup is complete.

---

## 24. How to Play

Use:

- **`popup_how_to_play_bg.png`**

The artwork contains the frame/title and empty content space.

Instruction text is rendered in code so it can be changed without regenerating art.

Suggested content:

- Move: Arrow keys / WASD
- Dig: stand next to a block and click it
- Pickaxe cursor: block can be mined
- Grammar: answer correctly to reveal hidden Gems
- Collect: walk onto revealed Gems to pick them up
- Chests: move toward an adjacent chest to open it; some contain treasure, some contain ghosts
- Goal: collect as many Gems as possible in 2 minutes

---

## 25. Results Popup

Use:

- **`popup_results_bg.png`**

Approved artwork contains:

- blue ribbon title `Level completed`;
- open treasure chest full of coloured Gems;
- large empty statistics area;
- bottom button `Play again`;
- second red button `Back to camp`.

Statistics are rendered in code inside the empty area:

- Gems collected;
- Blocks mined;
- Grammar correct / attempted;
- Ghosts defeated;
- Deepest level reached.

### Interaction with baked-in buttons

Because the two result buttons are part of the image, place transparent HTML hit areas exactly over them.

Optional hover feedback can be added using CSS glow/outline overlays around the button regions. Separate button-image assets are not required.

---

## 26. Game State

Suggested high-level state:

```js
const gameState = {
  status: "start",
  selectedTopic: null,
  currentLevel: 1,
  timeRemaining: 120,
  timerPaused: false,
  gems: 0,
  hamsterPosition: { x: 0, y: 0 },
  hamsterState: "idle",
  facing: "right",
  activeChallenge: null,
  stats: {
    blocksMined: 0,
    grammarAttempted: 0,
    grammarCorrect: 0,
    ghostsDefeated: 0,
    deepestLevel: 1
  }
};
```

`gems` remains the internal score variable even though some baked UI art uses the word `diamonds`.

---

## 27. Grammar Data Architecture

Grammar questions must live separately from gameplay logic.

Suggested shape:

```js
{
  topic: "present-simple",
  difficulty: "standard",
  type: "multiple-choice",
  question: "Tom ___ to school every day.",
  answers: ["go", "goes", "going"],
  correct: "goes"
}
```

Typed example:

```js
{
  topic: "present-simple",
  difficulty: "hard",
  type: "typed-form",
  question: "My parents ___ (not/work) on Sundays.",
  acceptedAnswers: ["don't work", "do not work"]
}
```

---

## 28. Recommended Configuration

Level weights and reward probabilities must be configuration data rather than scattered magic numbers.

Example:

```js
const levels = [
  { id: 1, dirt: 35, stone: 45, gold: 12, hard: 8, chestCount: 2 },
  { id: 2, dirt: 20, stone: 40, gold: 20, hard: 20, chestCount: 3 },
  { id: 3, dirt: 10, stone: 30, gold: 25, hard: 35, chestCount: 4 }
];
```

These numbers remain playtesting placeholders.

---

## 29. Canonical Asset Manifest

The authoritative list of production assets, exact filenames, and production folders is maintained in:

- **`Grammar_Gold_Rush_Asset_Manifest.md`**

Do **not** duplicate or reinterpret the asset tree from older drafts of this specification.

The current production structure is:

```text
assets/
├── background/
├── blocks/
├── objects/
├── rewards/
├── hamster/
├── ui/
│   ├── hud/
│   ├── start/
│   └── popups/
└── effects/
```

Key integration rules:

- `sky_background.png` and `world_background.png` are in `assets/background/`.
- Blocks are in `assets/blocks/`.
- `chest_closed_tile.png` is in `assets/objects/`.
- Gem reward graphics are in `assets/rewards/`.
- Hamster sprite sheets are in `assets/hamster/`.
- HUD graphics are in `assets/ui/hud/`.
- Start-screen graphics, including `topic_select_popup.png`, are in `assets/ui/start/`.
- Gameplay/modal popup graphics are in `assets/ui/popups/`.
- Cursors, crack overlays and `debris_dirt_particles.png` are in `assets/effects/`.

If this document and `Grammar_Gold_Rush_Asset_Manifest.md` ever disagree about a filename, folder, or graphic composition, the **Asset Manifest is authoritative**.

The current v1 manifest defines **45 canonical visual files**.

---

## 30. Assets / Approaches Explicitly Removed

The following old ideas must **not** be recreated by Codex or treated as required assets:

- separate `surface_top_strip.png`;
- separate `shaft_hole_top.png`;
- repeated `tunnel_bg_tile.png`;
- `tunnel_step_overlay.png`;
- separate clock icon for the HUD;
- separate diamond icon for the HUD;
- image-based grammar answer buttons;
- open-chest animation on the map;
- roaming Ghost sprites on the map;
- separate left-facing hamster sprite sheets;
- separate Level 1/2/3 background images for v1;
- volume slider;
- extra decorative asset catalog images generated during exploration but never approved.

Use only the canonical manifest above unless the specification is deliberately revised.

---

## 31. Suggested Core Functions

```text
startGame()
openTopicSelect()
confirmTopic()
runStartTransition()

loadLevel()
generateLevel()
startGlobalTimer()
pauseGlobalTimer()
resumeGlobalTimer()

moveHamster()
canMoveTo()
revealCell()
revealNeighbours()

canMine()
hitBlock()
playMiningAnimation()
applyCrackOverlay()
showDebris()
destroyBlock()

openGrammarChallenge()
checkGrammarAnswer()
resolveBlockReward()
showRewardAsset()

openChest()
showTreasurePopup()
startGhostChallenge()
resolveGhostChallenge()

addGems()
removeGems()

activateLevelExit()
startLevelTransition()
loadNextLevel()

endGame()
showResults()
```

Responsibilities should remain separated even if function names change.

---

## 32. Recommended Development Order

1. Build 1280×720 responsive game shell.
2. Add fixed sky background.
3. Add movable `world_background` and verify Start → Gameplay vertical transition.
4. Align the 13×6 grid to the baked grass hole.
5. Render Hidden / Revealed / Open cells.
6. Add hamster movement and sprite mirroring.
7. Add custom cursor switching.
8. Add block HP, mining animation, crack overlays and debris.
9. Add `popup_grammar_bg` with HTML/CSS multiple-choice controls.
10. Add typed Hard Rock mode using the same popup.
11. Add hidden reward objects and score HUD.
12. Add Lucky 7.
13. Add chest logic and treasure popup.
14. Add Ghost Challenge and two outcome popups.
15. Add level-exit special cell and transitions.
16. Add Level 2 / Level 3 distributions.
17. Add How to Play, pause and music toggle.
18. Add Results popup and button hit zones.
19. Add sound/music.
20. Balance probabilities, movement and timing.

---

## 33. Fixed Decisions Summary

The following are fixed for v1 unless playtesting finds a serious usability problem:

- game name: **Grammar Gold Rush**;
- 1280×720 logical viewport;
- 16:9;
- six full visible mine rows;
- exactly 13 columns;
- one fixed sky background;
- one continuous grass + underground world background;
- no repeated tunnel tile;
- one-cell grass hole baked into the world background;
- background hole and grid must align exactly;
- fixed HUD: timer + score left, logo centre, four control buttons right;
- no volume slider;
- global game time: **2 minutes**;
- one grammar topic per session;
- up to three levels on one timer;
- grammar difficulty stays constant across depth;
- fog of war;
- open tunnel = world background revealed;
- movement: arrows + WASD;
- orthogonal movement/mining only;
- two cursor states: default and pickaxe;
- Dirt 1 hit, no grammar;
- Stone 3 hits + multiple choice;
- Gold Stone 3 hits + multiple choice + better rewards;
- Hard Rock 5 hits + typed grammar form;
- crack damage uses overlays, not separate block variants;
- debris appears on impact;
- standard grammar timer = 10 sec;
- Ghost timer = 5 sec;
- every gameplay modal blocks world input and pauses the global timer;
- challenge-local timers continue while the global timer is paused;
- mandatory Grammar/Ghost challenges have no close X;
- informational popups use a universal HTML/CSS close X;
- wrong grammar answer never blocks progression;
- normal rewards: empty / +1 / +2 / +3;
- reward art maps to the four approved reward assets;
- revealed block rewards remain on the map until the hamster walks onto their cell;
- Gem score increases at physical pickup, with sound + floating `+N` + HUD pulse;
- one Lucky 7 per level and it is also physically collected;
- chests are separate non-traversable cells until consumed;
- primary chest activation = movement input toward an adjacent chest;
- no map chest-opening animation;
- chest is removed and its cell opens only after its popup flow resolves;
- haunted chest uses a popup Ghost event;
- Ghost correct = +2;
- Ghost wrong/timeout = −2, score floor 0;
- level descent can be code-rendered; no extra exit PNG required;
- hamster base art faces right; left uses mirroring;
- mining damage is synchronised to the impact frame;
- results popup uses baked Play again and Back to camp buttons with HTML hit areas;
- Energy + Carrots remain Phase 2.

---

## 34. Open Values for Playtesting

- exact cell size after final background alignment;
- exact start/world Y offsets;
- movement duration (baseline ~150 ms/cell);
- mining swing duration (baseline ~280 ms);
- distant explored-tunnel dim amount;
- reward probabilities;
- chest count and Haunted probability;
- route-generation constraints;
- typed challenge time if 10 sec proves too short;
- pickup pop/floating-text duration;
- chest activation feedback timing;
- whether informational popup X also supports Escape;
- duration of treasure/Ghost outcome popups;
- Level 2/3 colour overlays.

---

## 35. Phase 2 / Later

Possible later additions:

- Energy + Carrots;
- mobile touch controls;
- localStorage high scores;
- shared Gems across all three website mini-games;
- more grammar topics;
- achievements;
- more level themes/backgrounds;
- more particle variants;
- teacher-configurable question banks.

The v1 architecture should not make these extensions difficult, but they are outside the first implementation.
