# HAMSTER'S GRAMMAR MINE — Showcase Asset Manifest

**Version:** 1.1  
**Status:** Production naming / composition source of truth  
**Scope:** Main showcase / hub only. Mini-game assets are documented separately.

---

## 1. Purpose

This manifest defines:

- canonical filenames;
- recommended folders;
- which visuals are already baked into PNG assets;
- which content must remain dynamic and be rendered by HTML/CSS/JS;
- which older/temporary asset ideas are deprecated.

For exact hub behaviour, use `HAMSTERS_GRAMMAR_MINE_Showcase_Spec.md`.

---

## 2. Exact production folder structure

Use this exact structure for showcase production assets:

```text
assets/
└── shared/
    └── showcase/
        ├── background/
        │   └── hub_background_main.png
        │
        ├── branding/
        │   └── hub_logo.png
        │
        ├── cards/
        │   ├── card_grammar_gold_rush.png
        │   ├── card_mine_cart_express.png
        │   └── card_haunted_grammar_cave.png
        │
        ├── profile/
        │   └── profile_panel_bg.png
        │
        ├── avatars/
        │   ├── avatar_rapper.png
        │   ├── avatar_old_timer.png
        │   ├── avatar_fashion_girl.png
        │   ├── avatar_explorer_girl.png
        │   ├── avatar_miner.png
        │   └── avatar_extreme.png
        │
        ├── badges/
        │   ├── badge_rookie_miner.png
        │   ├── badge_cave_explorer.png
        │   ├── badge_gem_hunter.png
        │   ├── badge_gold_digger.png
        │   ├── badge_mine_expert.png
        │   └── badge_grammar_mine_master.png
        │
        ├── popups/
        │   ├── modal_welcome_bg.png
        │   ├── modal_profile_bg.png
        │   └── modal_rank_up_bg.png
        │
        └── ui/
            ├── ui_close_button.png
            ├── ui_hover_arrow_circle.png
            ├── ui_gem_icon.png
            ├── ui_avatar_selected.png
            ├── session_icon_gold_rush.png
            ├── session_icon_mine_cart.png
            └── session_icon_haunted_cave.png
```

### Important folder rule

There is **no `text/` folder** and no separate image folder for dynamic labels.

Dynamic text, numbers, player data, progress values, session data, `+N Gems`, button labels and rank-up text are rendered by HTML/CSS/JavaScript.

Do not place showcase graphics inside the Grammar Gold Rush game asset folders. The showcase and the mini-game remain separate systems:

```text
assets/shared/showcase/              ← main hub / showcase only
games/grammar-gold-rush/assets/      ← Grammar Gold Rush only
```

---

# 3. Background and branding

## 01. `background/hub_background_main.png`

**Role:** full-screen showcase environment.

**Contains:**
- cave/mining valley/camp environment;
- large hub hamster;
- the three progression signs:
  - `LEARN GRAMMAR`
  - `EARN GEMS`
  - `BECOME A MASTER`;
- natural hamster ground shadow and environmental integration.

**Does NOT contain:**
- project logo;
- compact profile panel;
- game cards;
- modal windows.

**Important:** hamster and progression signs are intentionally baked into this background. Do not recreate them as extra layered production images.

---

## 02. `branding/hub_logo.png`

**Role:** standalone `HAMSTER'S GRAMMAR MINE` logo.

**Format:** transparent PNG.

**Contains:** only the approved decorative project logo.

**Dynamic:** no.

---

# 4. Game cards

The cards are complete clickable cover images. Their visible `PLAY` buttons are baked into the card art, but the entire card receives one HTML click target.

## 03. `cards/card_grammar_gold_rush.png`

**Role:** featured/main game card.

**Contains:**
- Grammar Gold Rush cover art;
- title;
- visible green `PLAY`;
- approved `FEATURED` ribbon.

**Important ribbon rule:** use the corrected final card where the blue ribbon wraps naturally around the upper-left card edge.

---

## 04. `cards/card_mine_cart_express.png`

**Role:** bonus card.

**Contains:**
- cover art;
- title;
- blue `PLAY`;
- purple `BONUS` ribbon.

---

## 05. `cards/card_haunted_grammar_cave.png`

**Role:** bonus card.

**Contains:**
- cover art;
- title;
- purple `PLAY`;
- purple `BONUS` ribbon.

---

# 5. Compact profile

## 06. `profile/profile_panel_bg.png`

**Role:** blank compact profile panel shown in the upper-right hub area.

**Contains:**
- approved cream/light panel;
- thin elegant gold frame;
- subtle parchment/panel texture.

**Must be empty inside.**

**Does NOT contain:**
- avatar;
- name;
- Gem icon;
- Gem count;
- rank badge;
- progress text;
- progress fill;
- extra Master star/badge.

All of those are layered by code.

---

# 6. Avatar assets

Each avatar is a **separate file**.

All six:

- use the same thin gold circular frame;
- have a finished internal background;
- are displayed as complete portrait icons;
- must show hamster paws rather than human hands/fingers.

## 07. `avatars/avatar_rapper.png`

Purple/black rapper hamster.

---

## 08. `avatars/avatar_old_timer.png`

Eccentric older hamster / professor-style character.

---

## 09. `avatars/avatar_fashion_girl.png`

Pink fashionable hamster girl.

---

## 10. `avatars/avatar_explorer_girl.png`

Girl explorer.

**Required traits:**
- round glasses;
- safari/explorer hat;
- green leafy/jungle background;
- no human hairstyle;
- hamster paws.

---

## 11. `avatars/avatar_miner.png`

Classic friendly miner hamster with yellow helmet/pickaxe theme.

---

## 12. `avatars/avatar_extreme.png`

Extreme-sports hamster with blue helmet/goggles/skateboard theme.

---

# 7. Rank badge assets

Every rank badge is a separate transparent PNG and already includes its rank name.

## 13. `badges/badge_rookie_miner.png`

Threshold: **0 Gems**

---

## 14. `badges/badge_cave_explorer.png`

Threshold: **50 Gems**

---

## 15. `badges/badge_gem_hunter.png`

Threshold: **110 Gems**

---

## 16. `badges/badge_gold_digger.png`

Threshold: **180 Gems**

---

## 17. `badges/badge_mine_expert.png`

Threshold: **260 Gems**

---

## 18. `badges/badge_grammar_mine_master.png`

Threshold: **350 Gems**

This is the final/max-rank badge.

---

# 8. Popup backgrounds

## 19. `popups/modal_welcome_bg.png`

**Role:** first-launch onboarding popup.

**Must visually match the approved tall Welcome window.**

**Contains:**
- exact approved outer proportions;
- approved metal/wood frame;
- blue `WELCOME TO HAMSTER'S GRAMMAR MINE!` header;
- approved divider lines and Gem decorations;
- clean continuous parchment texture.

**Does NOT contain:**
- close X;
- player name prompt;
- input text;
- six avatar PNGs;
- selected check;
- Start Mining button;
- helper text.

Those are rendered by code.

**Important:** any areas previously manually painted beige in the mockup must be fully restored to one natural, even parchment texture. No visible paint patches / bright rectangles.

---

## 20. `popups/modal_profile_bg.png`

**Role:** detailed player profile popup.

**Must preserve the exact approved proportions/layout of the final profile concept.**

**Contains:**
- `MY MINER PROFILE` header;
- large clean top summary area;
- four fixed stat tiles/areas;
- baked stat icons:
  - game controller;
  - green correct-answer check;
  - ghost;
  - Best Gold Rush treasure/gold icon;
- three recent-session rows;
- **blank icon slots** at the left of each recent-session row;
- baked visual `BACK TO CAMP` button.

**Does NOT contain:**
- close X;
- avatar;
- player name;
- Gem icon/count;
- current rank badge;
- progress text/data;
- stat numbers;
- session game icons;
- session names/topics/Gem values.

**Important:** no Photoshop-style beige patches or light rectangles. All empty areas must use the natural continuous parchment texture.

**Interaction:** place a real HTML hit target over the baked `BACK TO CAMP` visual button.

---

## 21. `popups/modal_rank_up_bg.png`

**Role:** celebratory rank promotion popup.

**Contains:**
- `RANK UP!` header;
- simplified celebratory mining frame;
- one **large beige circular center** with a thin gold border.

The beige circle must be intentionally larger than the earlier blue placeholder area and must leave enough room for:

- one rank badge PNG;
- dynamic rank title;
- optional short congratulatory text.

**Does NOT contain:**
- a specific badge;
- rank name;
- close X;
- Continue/Awesome button.

Continue button is code-rendered.

---

# 9. General UI assets

## 22. `ui/ui_close_button.png`

Standalone round red X button with gold/mining-style rim.

**Used for:**
- detailed profile modal;
- other closable showcase popups if added later.

**Not used for:**
- Welcome;
- Rank Up.

---

## 23. `ui/ui_hover_arrow_circle.png`

Standalone blue circular arrow with gold rim.

Appears over a game card on hover.

---

## 24. `ui/ui_gem_icon.png`

Canonical showcase currency icon.

**Design:**
- one bright standard blue faceted diamond;
- no text;
- no surrounding panel;
- transparent background.

**Used for:**
- compact profile Gem total;
- profile modal;
- `+N` return reward effect;
- other showcase Gem labels.

Use this one icon consistently instead of pulling different diamonds from other images.

---

## 25. `ui/ui_avatar_selected.png`

Small green success/check indicator used as an overlay on the currently selected onboarding avatar.

Transparent PNG.

---

# 10. Dynamic Recent Session icons

These must remain separate because recent history can contain any game in any order, including repeats.

## 26. `ui/session_icon_gold_rush.png`

Small square icon representing Grammar Gold Rush.

---

## 27. `ui/session_icon_mine_cart.png`

Small square icon representing Mine Cart Express.

---

## 28. `ui/session_icon_haunted_cave.png`

Small square icon representing Haunted Grammar Cave.

---

# 11. Canonical graphic asset list with exact paths

All paths below are relative to the project root.

```text
01  assets/shared/showcase/background/hub_background_main.png
02  assets/shared/showcase/branding/hub_logo.png

03  assets/shared/showcase/cards/card_grammar_gold_rush.png
04  assets/shared/showcase/cards/card_mine_cart_express.png
05  assets/shared/showcase/cards/card_haunted_grammar_cave.png

06  assets/shared/showcase/profile/profile_panel_bg.png

07  assets/shared/showcase/avatars/avatar_rapper.png
08  assets/shared/showcase/avatars/avatar_old_timer.png
09  assets/shared/showcase/avatars/avatar_fashion_girl.png
10  assets/shared/showcase/avatars/avatar_explorer_girl.png
11  assets/shared/showcase/avatars/avatar_miner.png
12  assets/shared/showcase/avatars/avatar_extreme.png

13  assets/shared/showcase/badges/badge_rookie_miner.png
14  assets/shared/showcase/badges/badge_cave_explorer.png
15  assets/shared/showcase/badges/badge_gem_hunter.png
16  assets/shared/showcase/badges/badge_gold_digger.png
17  assets/shared/showcase/badges/badge_mine_expert.png
18  assets/shared/showcase/badges/badge_grammar_mine_master.png

19  assets/shared/showcase/popups/modal_welcome_bg.png
20  assets/shared/showcase/popups/modal_profile_bg.png
21  assets/shared/showcase/popups/modal_rank_up_bg.png

22  assets/shared/showcase/ui/ui_close_button.png
23  assets/shared/showcase/ui/ui_hover_arrow_circle.png
24  assets/shared/showcase/ui/ui_gem_icon.png
25  assets/shared/showcase/ui/ui_avatar_selected.png
26  assets/shared/showcase/ui/session_icon_gold_rush.png
27  assets/shared/showcase/ui/session_icon_mine_cart.png
28  assets/shared/showcase/ui/session_icon_haunted_cave.png
```

Total canonical showcase graphic assets: **28**

# 12. What must be rendered by code

Do not create production PNGs for:

- player name;
- Gem count;
- `+N` Gem reward text;
- progress text;
- progress bar fill;
- current segment math;
- player/session statistics;
- recent-session text;
- Welcome form labels/input;
- Start Mining button;
- disabled/active/hover Start Mining states;
- Rank Up badge placement;
- Rank Up dynamic title;
- Rank Up Continue/Awesome button;
- dimmed modal overlay;
- hover scale/glow effects;
- profile hover glow;
- focus outlines;
- session dates/topics/Gem values.

---

# 13. Baked-vs-dynamic boundaries

### Baked into hub background

- hub hamster;
- progression signs;
- scenery/shadows.

### Separate hub layers

- logo;
- compact profile;
- three game cards.

### Baked into game cards

- covers;
- titles;
- `PLAY` visuals;
- Featured/Bonus ribbons.

### Dynamic over compact profile

- avatar;
- name;
- Gem icon/count;
- badge;
- progress text/bar.

### Baked into profile modal

- title;
- fixed stat icons;
- structural boxes/rows;
- Back to Camp visual.

### Dynamic over profile modal

- avatar/name/Gems/badge/progress;
- stat numbers;
- session icons;
- session text/data;
- close X.

### Dynamic over Welcome modal

- prompts;
- input;
- six avatar PNGs;
- selected check;
- Start Mining button.

### Dynamic over Rank Up modal

- new badge;
- rank title;
- Continue/Awesome button.

---

# 14. Deprecated / do not use

Do not keep these as production requirements:

- separate `hub_mascot_hamster.png`;
- separate `hub_progress_signs.png`;
- Welcome background with baked Start Mining button;
- Welcome background with baked avatars;
- Welcome X button;
- profile modal with baked X;
- profile modal with fixed session-game icons;
- profile modal with sample player data;
- rank-up popup with a fixed badge;
- rank-up popup with a fixed rank title;
- rank-up popup with an oversized lower pile of decorative UI clutter;
- separate PNG progress bar;
- separate PNG `+18` text;
- fixed Master star beside a non-Master profile.

---

# 15. Optional audio — not required to block prototype

These were discussed but are not part of the 28 canonical graphic assets.

Recommended later:

```text
audio/ui_click.*
audio/gem_reward.*
audio/rank_up.*
```

The prototype may initially use no audio or temporary audio.

---

# 16. Recommended reference-only folder

Approved screenshots/concepts may be kept for Codex comparison, but they are **not production assets**.

```text
docs/showcase/references/
├── showcase_main_reference.png
├── showcase_welcome_reference.png
└── showcase_profile_reference.png
```

Codex should use them for visual comparison only.

---

# 17. Source-of-truth hierarchy

1. Showcase Spec — behaviour.
2. This Asset Manifest — exact filenames and baked/dynamic asset boundaries.
3. Approved reference screenshots — visual comparison.

If an old concept contradicts this manifest, this manifest wins for asset composition.

---

**End of Showcase Asset Manifest v1.1**
