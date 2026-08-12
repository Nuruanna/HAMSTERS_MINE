# Grammar Gold Rush — Asset Manifest
**Version:** 1.1  
**Status:** Source of truth for graphics/assets  
**Project path:** `games/grammar-gold-rush/`

This file defines the **canonical asset filenames, folders, purpose, and integration rules** for the first playable version of **Grammar Gold Rush**.

> Important: the image generator produced some files with automatic/Russian filenames.  
> **Do not use those generated filenames in code.** Rename the approved images to the canonical names below when importing them into Visual Studio.

---

## 1. Recommended folder structure

```text
games/
└── grammar-gold-rush/
    ├── index.html
    ├── css/
    │   └── game.css
    ├── js/
    │   ├── game.js
    │   ├── map.js
    │   ├── hamster.js
    │   ├── questions.js
    │   └── ui.js
    └── assets/
        ├── background/
        ├── blocks/
        ├── objects/
        ├── rewards/
        ├── hamster/
        ├── ui/
        │   ├── hud/
        │   ├── start/
        │   └── popups/
        ├── effects/
        └── audio/
```

The first version uses **45 canonical graphic assets**.

---

# 2. Background and map base

## `assets/background/sky_background.png`

**Purpose:** one continuous sky background used both on the start screen and during the transition into the mine.

**Rules:**
- The same sky remains behind the scene before and after pressing Start.
- Do not create a second sky specifically for gameplay.
- The HUD is a separate fixed layer above it.
- The moving world layer is placed over this sky.

---

## `assets/background/world_background.png`

**Approved source:** the final manually corrected `Grass.png`.

**Purpose:** the single continuous world background placed over `sky_background.png`.

It already contains:
- the grass strip across the full width;
- the correctly positioned one-cell-wide hole in the grass;
- the continuous brown underground background below the grass.

**Critical implementation rule:**

Do **not** generate the open tunnel from repeated square tunnel tiles.

An excavated/open cell simply means:
1. the block image is removed;
2. the continuous `world_background.png` becomes visible underneath.

This prevents seams and mismatched tunnel backgrounds.

**Start transition:**
- On the start screen this world layer begins lower on the page, leaving mostly sky visible.
- After topic selection, move this whole world layer upward.
- The sky remains the same continuous background.
- The HUD stays fixed.

---

## `assets/background/tile_dark_hidden.png`

**Purpose:** fog-of-war overlay for unrevealed cells.

**Rules:**
- Applied per grid cell.
- Removed/faded when a cell becomes discovered.
- Open tunnels must never return to fully hidden state.
- Distant opened areas may be visually dimmed by code, but not replaced with block art.

---

# 3. Mine blocks

All four blocks must:
- occupy exactly one grid cell;
- use one consistent image per material type;
- have the same rendered dimensions;
- be aligned to the same cell bounds;
- contain no built-in cracks.

## `assets/blocks/block_dirt.png`
**Game mechanic:** 1 mining hit, no grammar challenge.

## `assets/blocks/block_stone.png`
**Game mechanic:** 3 mining hits, then standard multiple-choice Grammar Challenge.

Visual: brown-earth base with several distinct gray stones and visible earth between them.

## `assets/blocks/block_hard_rock.png`
**Game mechanic:** 5 mining hits, then typed grammar-form challenge.

Visual: dense gray faceted/interlocking rock mass.

## `assets/blocks/block_gold_ore.png`
**Game mechanic:** 3 mining hits, then standard Grammar Challenge with improved gem probabilities.

Visual: rocky/earth base with a modest amount of bright gold.

---

# 4. Map object

## `assets/objects/chest_closed_tile.png`

**Purpose:** the only chest graphic displayed directly on the map.

**Rules:**
- A chest is its own map cell/object, not a reward hidden inside a normal block.
- The chest is visible only after its cell is discovered.
- An unopened chest cell is not traversable.
- Primary activation: from an adjacent orthogonal cell, the player presses movement toward the chest.
- Optional alternative: click the adjacent chest.
- The hamster remains in the adjacent cell while the event runs.
- Mark the chest consumed immediately on trigger to prevent duplicate activation.
- There is **no chest-opening animation on the map**.
- After interaction, show either the Treasure popup or Ghost popup.
- Remove the chest and convert its cell to Open only after the popup flow is finished.

---

# 5. Hidden gem rewards

The visual reward asset corresponds directly to the number of gems awarded.

## `assets/rewards/gem_blue.png`
One blue diamond.

**Reward:** `+1 Gem`

---

## `assets/rewards/gem_green_red.png`
Two diamonds together: green + red.

**Reward:** `+2 Gems`

---

## `assets/rewards/gem_purple_pink_yellow.png`
Three diamonds together: purple/lilac + pink + yellow.

**Reward:** `+3 Gems`

---

## `assets/rewards/lucky7_reward.png`
Pile of multicolored diamonds with sparkling text:

**`Lucky 7`**

**Reward:** `+7 Gems`

**Rules:**
- Exactly one Lucky 7 reward is preassigned per level at map generation.
- It is hidden until its block is successfully mined.
- Correct grammar answer reveals the reward in the open cell.
- The reward remains on the map until the hamster physically enters that cell.
- Score increases only on pickup.
- Wrong answer/timeout loses the contents of that cell.
- The cell still becomes open in either case.

---

# 6. Hamster sprite assets

The approved hamster is the final side-oriented miner design.

**General rules for every sheet:**
- transparent background;
- identical canvas size per frame;
- identical character scale;
- identical foot/body anchor;
- no camera movement;
- enough empty canvas for the pickaxe swing;
- character must fit comfortably inside one tunnel cell;
- the hamster's head must remain below the one-cell tunnel ceiling.

Left-facing movement/mining should be created by **horizontal mirroring in code**. Do not store duplicate left sprite sheets.

---

## `assets/hamster/hamster_idle_right.png`

Default right-facing idle pose.

Use while the player is not moving or mining.

---

## `assets/hamster/hamster_walk_right_sheet.png`

Approx. 4-frame horizontal walking loop.

Use:
- right as drawn;
- left by `scaleX(-1)` / horizontal mirroring.

---

## `assets/hamster/hamster_climb_sheet.png`

Approx. 4-frame vertical movement/climbing sequence.

Used for movement up/down through open cells.

---

## `assets/hamster/hamster_mine_side_sheet.png`

Approx. 3–4 frames:
1. lift;
2. swing;
3. impact;
4. recovery if present.

**Important:** block damage is applied on the **impact frame**, not on mouse-down.

Mirror for mining to the left.

---

## `assets/hamster/hamster_mine_up_sheet.png`

Mining animation for an adjacent block above the hamster.

---

## `assets/hamster/hamster_mine_down_sheet.png`

Mining animation for an adjacent block below the hamster.

---

# 7. HUD assets

HUD is fixed to the viewport and does not move with the world.

## `assets/ui/hud/logo_grammar_gold_rush.png`

Centered at the top over the sky.

No full-width wooden header strip behind it.

---

## `assets/ui/hud/timer_panel_bg.png`

Includes:
- timer panel artwork;
- timer/clock icon.

Does **not** include dynamic time digits.

Code overlays text such as:

```text
02:00
01:17
00:09
```

---

## `assets/ui/hud/gems_panel_bg.png`

Includes:
- gems counter panel artwork;
- blue diamond icon.

Does **not** include the dynamic number.

Code overlays the gem total.

---

## `assets/ui/hud/button_music_on.png`

Music enabled.

Clickable image/button.

---

## `assets/ui/hud/button_music_off.png`

Music disabled.

Clicking the music control swaps between `music_on` and `music_off`.

---

## `assets/ui/hud/button_help.png`

Opens `popup_how_to_play_bg.png`.

---

## `assets/ui/hud/button_pause.png`

Pauses gameplay and the main timer.

---

## `assets/ui/hud/button_close.png`

Red exit button.

Returns/exits according to the hosting site's navigation logic.

---

# 8. Start-screen assets

The start screen uses `sky_background.png` as its background.

The grass/world layer begins lower on the screen.

## `assets/ui/start/start_button.png`

Large central floating START button.

The approved hamster in a helmet is already sitting on top of this button as part of the asset.

Do **not** place an additional hamster sprite on the start button.

The button itself is interactive.

Recommended hover behavior via CSS:
- slight scale up;
- glow / brightness;
- small vertical lift.

---

## `assets/ui/start/how_to_play_button.png`

Smaller floating button below Start.

Opens How to Play popup.

---

## `assets/ui/start/back_button.png`

Smaller floating Back button below Start.

Used to return to the website/showcase.

---

## `assets/ui/start/topic_select_popup.png`

Popup frame for topic selection.

Contains the visual frame/title but leaves the topic-selection area free for code-generated controls.

Code inserts topic buttons/cards, e.g.:
- Present Simple
- Present Continuous
- Past Simple
- Future Forms

After the player confirms a topic:
- close the popup;
- animate the world upward;
- place hamster at the mine entrance/start cell;
- start the 2-minute main timer.

---

# 9. Gameplay popups

All dynamic grammar text should be HTML/CSS text layered over the popup image unless explicitly marked as baked into the asset.

---

## `assets/ui/popups/popup_grammar_bg.png`

Approved Grammar Challenge design.

**Image contains:**
- wooden/gold frame;
- `GRAMMAR CHALLENGE` heading;
- decorative mining elements;
- empty timer badge/panel.

**Image does NOT contain:**
- question text;
- answer text;
- answer buttons;
- timer digits.

Code overlays:
- question;
- timer digits;
- three answer buttons.

Answer buttons should be HTML/CSS so they can support:
- hover;
- pressed;
- correct state;
- wrong state;
- disabled state.

Main game timer is paused while this popup is active.

Challenge timer: 10 seconds.

This is a mandatory challenge:
- **no close X**;
- Escape/backdrop click must not dismiss it;
- it ends only by answer or timeout.

---

## `assets/ui/popups/popup_treasure_bg.png`

Treasure-chest event popup.

Shows a large open chest full of gems.

No chest-opening animation is required on the map.

Use after interacting with a Treasure Chest.

Reward logic is handled by code:
- +3 Gems is applied once when the popup opens;
- the global timer remains paused;
- the popup closes with the universal code-rendered X;
- after close, the consumed chest is removed and its cell becomes Open.

---

## `assets/ui/popups/popup_ghost_bg.png`

Wide popup titled:

**`A ghost!`**

**Image layout:**
- left: open empty chest;
- a threatening ghost has flown out of the chest;
- right: large empty area for challenge content;
- timer panel/badge is present but has no digits.

Code overlays on the right:
- question;
- two answer options;
- challenge timer digits.

Ghost Challenge timer: 5 seconds.

Main game timer is paused while this popup is active.

This is a mandatory challenge:
- **no close X**;
- Escape/backdrop click must not dismiss it.

---

## `assets/ui/popups/popup_ghost_stole_bg.png`

Small outcome popup.

Contains:
- happy/satisfied ghost carrying away two diamonds;
- no chest;
- baked text:

**`O, no! The ghost stole 2 diamonds!`**

Gameplay effect:
- subtract 2 Gems;
- gem total cannot fall below 0.

This is an informational result popup and uses the universal code-rendered close X.

---

## `assets/ui/popups/popup_ghost_defeated_bg.png`

Small success outcome popup.

Contains:
- defeated ghost;
- baked text:

**`Ghost defeated!`**

and below:

**`+2`**

with two differently colored diamonds.

Gameplay effect:
- add 2 Gems;
- increment Ghosts Defeated statistic.

This is an informational result popup and uses the universal code-rendered close X.

---

## `assets/ui/popups/popup_how_to_play_bg.png`

How to Play popup.

Used from:
- start screen;
- HUD help button.

Treat the approved final image as the visual reference/source.

Close/back interaction is handled by code using the universal HTML/CSS close X.

---

## `assets/ui/popups/popup_results_bg.png`

Final/level-completion results popup.

**Image contains:**
- blue ribbon with text `Level completed`;
- open treasure chest full of gems;
- large empty area for final statistics;
- two buttons at the bottom:
  1. `Play again`
  2. red `Back to camp`

Code overlays statistics in the empty area:
- Gems
- Blocks mined
- Grammar correct / attempted
- Ghosts defeated
- Deepest level

### Button interaction
The buttons are already visually present in the image.

Results has **no close X**. The player must choose `Play again` or `Back to camp`.

Overlay clickable HTML elements/hit areas precisely over them.

Optional CSS hover effect:
- subtle glow;
- slight scale;
- brightness shift.

Do not duplicate visible button artwork unless the popup is redesigned later.

---

# 10. Effects and cursor assets

## `assets/effects/cursor_default.png`

Default game cursor.

Used when the mouse is not over a valid adjacent mineable block.

---

## `assets/effects/cursor_pickaxe.png`

Pickaxe cursor.

Use only when:
- target cell contains a mineable block;
- target cell is orthogonally adjacent to hamster;
- player is allowed to mine;
- no blocking popup/animation is active.

---

## `assets/effects/crack_overlay_1.png`
Mining damage stage 1.

## `assets/effects/crack_overlay_2.png`
Mining damage stage 2.

## `assets/effects/crack_overlay_3.png`
Mining damage stage 3.

## `assets/effects/crack_overlay_4.png`
Mining damage stage 4.

## `assets/effects/crack_overlay_5.png`
Mining damage stage 5.

**Rules:**
- crack overlays have transparent backgrounds;
- they are drawn over the original block;
- never permanently alter the original block asset;
- choose crack stage based on accumulated hits / required hits.

Example:

```text
Stone:     3 hits → use stages 1–3
Gold Ore:  3 hits → use stages 1–3
Hard Rock: 5 hits → use stages 1–5
Dirt:      breaks in 1 hit, crack overlay optional/not necessary
```

---

## `assets/effects/debris_dirt_particles.png`

Flying dirt/soil fragments shown briefly on the mining impact frame.

**Rules:**
- transparent background;
- visual effect only;
- must not block clicks;
- short-lived;
- synchronized with the mining impact frame.

Optional later improvement: add separate stone debris, but it is **not required for v1**.

---

# 11. Layer order during gameplay

Recommended visual stacking from back to front:

```text
1. sky_background
2. world_background
3. revealed reward object (invisible while hidden; remains in its cell until physically collected)
4. blocks / closed chest
5. fog-of-war overlays
6. crack overlay
7. hamster sprite
8. debris / reward effects
9. fixed HUD
10. modal overlay / popup
11. HTML question text, timer text, buttons, statistics
```

Note: exact DOM/canvas structure may differ, but the visual result must follow this logic.

---

# 11A. Universal modal-close and pause policy

No additional graphical close-button asset is required.

Use one reusable HTML/CSS close control for closable popups.

| Popup | Code X |
|---|---:|
| `topic_select_popup.png` | yes |
| `popup_how_to_play_bg.png` | yes |
| `popup_grammar_bg.png` | **no** |
| `popup_treasure_bg.png` | yes |
| `popup_ghost_bg.png` | **no** |
| `popup_ghost_stole_bg.png` | yes |
| `popup_ghost_defeated_bg.png` | yes |
| `popup_results_bg.png` | **no** |

Every gameplay modal blocks world interaction and pauses the 2-minute global timer.

Grammar/Ghost challenge-local timers continue while the global timer is paused.

If a final approved popup PNG already visually contains an X:
- use the real HTML/CSS close control/hit target over that location when the popup is closable;
- never make a challenge popup dismissible just because its art contains an X;
- visually mask a misleading baked X on a mandatory challenge if needed.

---

# 12. What must be rendered by code, not stored as image assets

Do not create separate PNGs for:

- timer digits;
- gems count;
- Grammar Challenge question text;
- Grammar Challenge answer labels;
- Grammar Challenge answer buttons;
- Ghost Challenge question/answer text;
- topic cards/buttons;
- final statistics;
- floating pickup text `+1`, `+2`, `+3`, `LUCKY 7! +7`;
- universal modal close X;
- `Correct!` / `Wrong!` feedback unless later intentionally redesigned;
- left-facing hamster sheets.

These are dynamic UI/content and should be HTML/CSS/JS.

---

# 13. Deprecated / rejected assets

The following concepts must **not** be used by Codex even if old generated files are still present locally:

```text
surface_top_strip.png
surface_top_strip_with_hole.png
shaft_hole_top.png
tunnel_bg_tile.png
tunnel_step_overlay.png
hamster_left_*.png
chest_open_on_map.png
ghost_roaming_on_map.png
```

Also ignore:
- old full gameplay mockups as implementation assets;
- earlier incorrect grass backgrounds;
- earlier tiled tunnel-background experiments;
- extra asset sheets generated accidentally during the design process.

Gameplay mockups may be kept only as visual references.

---

# 14. Canonical asset checklist — 45 files

```text
BACKGROUND / MAP
01  sky_background.png
02  world_background.png
03  tile_dark_hidden.png

BLOCKS
04  block_dirt.png
05  block_stone.png
06  block_hard_rock.png
07  block_gold_ore.png

OBJECTS
08  chest_closed_tile.png

REWARDS
09  gem_blue.png
10  gem_green_red.png
11  gem_purple_pink_yellow.png
12  lucky7_reward.png

HAMSTER
13  hamster_idle_right.png
14  hamster_walk_right_sheet.png
15  hamster_climb_sheet.png
16  hamster_mine_side_sheet.png
17  hamster_mine_up_sheet.png
18  hamster_mine_down_sheet.png

HUD
19  logo_grammar_gold_rush.png
20  timer_panel_bg.png
21  gems_panel_bg.png
22  button_music_on.png
23  button_music_off.png
24  button_help.png
25  button_pause.png
26  button_close.png

START
27  start_button.png
28  how_to_play_button.png
29  back_button.png
30  topic_select_popup.png

POPUPS
31  popup_grammar_bg.png
32  popup_treasure_bg.png
33  popup_ghost_bg.png
34  popup_ghost_stole_bg.png
35  popup_ghost_defeated_bg.png
36  popup_how_to_play_bg.png
37  popup_results_bg.png

EFFECTS
38  cursor_default.png
39  cursor_pickaxe.png
40  crack_overlay_1.png
41  crack_overlay_2.png
42  crack_overlay_3.png
43  crack_overlay_4.png
44  crack_overlay_5.png
45  debris_dirt_particles.png
```

---

# 15. Import checklist for Visual Studio / Codex

Before coding:

1. Create the folder structure from Section 1.
2. Copy only the approved images into the corresponding folders.
3. Rename each image to the canonical filename in Section 14.
4. Do not leave duplicate/old versions inside the production asset folders.
5. Put old mockups/reference images outside the production folders if they must be retained.
6. Verify transparency where required.
7. Verify the four block tiles render at identical square dimensions.
8. Verify all hamster sprite frames share the same canvas dimensions and anchor.
9. Verify `world_background.png` is the final manually corrected background with the grass hole correctly aligned to the grid.
10. Have Codex read:
   - `game-spec.md`
   - `wireframe.md`
   - `asset-manifest.md`
   before implementation.

---

# 16. Source-of-truth hierarchy

If documents appear to conflict, use this order:

1. **`game-spec.md`** — gameplay mechanics and rules.
2. **`wireframe.md`** — layout, positioning, screen states and transitions.
3. **`asset-manifest.md`** — exact graphics, filenames and integration rules.

For graphics filenames and asset composition, **this manifest is authoritative**.

