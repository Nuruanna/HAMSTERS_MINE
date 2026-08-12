# HAMSTER'S GRAMMAR MINE — Showcase / Main Hub Specification

**Version:** 1.1  
**Status:** Approved concept + approved progression / popup behaviour  
**Purpose:** Source of truth for the main showcase / game hub page of the HAMSTER'S GRAMMAR MINE project.

---

## 1. Product role

The showcase is a **full-screen game hub / mining camp**, not a conventional website homepage.

It connects all three mini-games into one shared player profile and one shared Gem/rank progression system.

The player should feel that they are entering one coherent game world, not a collection of unrelated grammar exercises.

Main goals:

- show all three games on one screen;
- clearly communicate that **Grammar Gold Rush** is the featured/main game;
- present **Mine Cart Express** and **Haunted Grammar Cave** as bonus games;
- show the player profile, total Gems, current rank and next-rank progress;
- motivate the player to earn Gems and advance to **Grammar Mine Master**;
- provide access to player statistics and recent sessions;
- visualize Gems earned after returning from a mini-game;
- celebrate rank advancement.

---

## 2. Global page rules

### 2.1 Full-screen layout

The main page must:

- fit into the browser viewport;
- have **no vertical page scroll** during normal desktop/laptop use;
- have no conventional full-width website header;
- place the logo, compact profile and game cards directly over the game-world scene;
- scale responsively while preserving the approved composition.

Primary target:

- desktop / laptop;
- 16:9 composition.

Use viewport-aware sizing such as `vh`, `vw`, `clamp()` and/or a fixed-aspect stage container.

Do not solve responsiveness by adding page scrolling.

If a smaller or differently proportioned screen crops peripheral scenery, preserve the important UI first:
1. compact profile;
2. game cards;
3. project logo.

---

## 3. Approved visual composition

The final approved hub composition contains:

- `HAMSTER'S GRAMMAR MINE` logo in the upper-left area;
- one cinematic mining/cave background;
- the large hub hamster **baked into the background**;
- the three progression signs **baked into the background**:
  - `LEARN GRAMMAR`
  - `EARN GEMS`
  - `BECOME A MASTER`
- compact player profile in the upper-right;
- one large Grammar Gold Rush card;
- two smaller bonus cards stacked vertically to its right.

Important production rule:

- the hub hamster and the three progression signs are **not separate production assets**;
- they are part of `hub_background_main.png`;
- the logo remains a separate asset so it can be positioned/scaled independently.

The approved concept is a layout/style reference, not one flattened final page. Interactive elements must remain separate HTML/CSS/JS layers.

---

## 4. Visual direction

Target audience:

- Grades 3–5.

Visual tone:

- modern;
- polished;
- colourful;
- premium cartoon game UI;
- cinematic mining/adventure world;
- exciting but not babyish.

The hub hamster may be more detailed than the in-game sprite but must remain recognizably the same character family.

---

## 5. Project logo

Display:

**HAMSTER'S GRAMMAR MINE**

Placement:

- upper-left;
- no separate header strip.

The logo is a standalone transparent asset and is layered over the hub background.

---

## 6. Game cards

There are exactly three cards.

### 6.1 Grammar Gold Rush

Featured/main game.

Rules:

- visually largest card;
- central-right area;
- its height is approximately equal to the combined height of the two bonus cards;
- contains baked cover art, title and visible `PLAY` button;
- may contain the approved `FEATURED` ribbon.

Important visual rule:

- the blue `FEATURED` ribbon must sit/wrap naturally around the upper-left card edge;
- do not use the earlier malformed/floating ribbon treatment.

### 6.2 Mine Cart Express

Bonus game.

- smaller card;
- upper-right bonus position;
- baked cover, title and `PLAY`;
- approved `BONUS` ribbon.

### 6.3 Haunted Grammar Cave

Bonus game.

- same dimensions as Mine Cart Express;
- lower-right bonus position;
- baked cover, title and `PLAY`;
- approved `BONUS` ribbon.

### 6.4 Click behaviour

The **entire card is clickable**, not only the baked `PLAY` button.

Clicking anywhere on a game card launches that game.

---

## 7. Game-card hover behaviour

On hover:

- cursor becomes `pointer`;
- card scales up slightly;
- soft glow/shadow/highlight appears;
- baked `PLAY` area may brighten through CSS filter;
- `ui_hover_arrow_circle.png` appears over the cover.

Initial prototype values:

- scale: about `1.02–1.04`;
- transition: about `180–250 ms`;
- smooth easing;
- no layout reflow.

The circular arrow is a separate overlay asset and is not baked permanently into the card.

---

## 8. Compact player profile

Placement:

- upper-right.

Base asset:

- `profile_panel_bg.png`

The profile panel asset is **empty inside**. Dynamic UI is layered over it.

Dynamic content:

- chosen avatar;
- player name;
- standard blue Gem icon;
- total Gem count;
- current rank badge;
- progress text to the next rank;
- CSS progress bar.

Important:

- only **one** current-rank badge is shown;
- there is no separate decorative `MASTER` marker before Master is actually earned;
- the profile frame itself does not change when the rank changes.

### 8.1 Hover/click

The profile is interactive.

On hover:

- cursor becomes `pointer`;
- avatar enlarges slightly (`~1.05–1.08`);
- avatar receives a soft glow;
- optional subtle highlight can appear on the whole profile panel.

Click:

- opens the detailed profile modal;
- does not navigate away from the hub.

---

## 9. First launch / onboarding

If no local player profile exists, open `modal_welcome_bg.png` before the player can use the hub.

### 9.1 Welcome modal behaviour

The Welcome modal:

- has **no close X**;
- cannot be dismissed by clicking outside;
- cannot be dismissed with Escape;
- must be completed to enter the hub.

The background asset contains:

- the approved `WELCOME TO HAMSTER'S GRAMMAR MINE!` header;
- approved dividers/decorative structure;
- otherwise clean parchment areas.

All functional content is rendered by code.

### 9.2 Player name

Render:

- prompt `What's your name?`;
- text input;
- optional short helper text.

### 9.3 Avatar selection

Render six avatar choices in a 3 × 2 grid.

The six approved avatar characters are:

1. rapper;
2. eccentric old-timer / professor;
3. fashion girl;
4. girl explorer with glasses, safari hat and green foliage background;
5. regular miner;
6. extreme-sports hamster.

All six avatar PNGs already include the **same thin gold circular frame**.

The explorer girl:

- has no human hairstyle;
- wears only the explorer/safari hat;
- has hamster paws, not human hands.

When selected:

- show `ui_avatar_selected.png` as a small overlay indicator.

### 9.4 Start Mining button

`START MINING!` is rendered as a real HTML/CSS button.

It is disabled until:

- the player name is non-empty after trimming;
- one avatar is selected.

No baked Start Mining button is required in `modal_welcome_bg.png`.

After successful submission:

- create the local player profile;
- assign `ROOKIE MINER`;
- close onboarding;
- reveal the hub.

For v1:

- one local browser profile is sufficient;
- multi-user switching is not required.

---

## 10. Shared Gem economy

All three mini-games add to the **same global Gem total**.

Global loop:

```text
Play any game
→ earn Gems
→ return to Camp
→ animate earned Gems
→ update total
→ update next-rank progress
→ optional Rank Up
```

Gems are the shared meta-progression currency of the showcase.

---

## 11. Approved rank system

The rank thresholds are now fixed for v1.

| Rank | Total Gems required | Segment size |
|---|---:|---:|
| `ROOKIE MINER` | 0 | starting rank |
| `CAVE EXPLORER` | 50 | +50 |
| `GEM HUNTER` | 110 | +60 |
| `GOLD DIGGER` | 180 | +70 |
| `MINE EXPERT` | 260 | +80 |
| `GRAMMAR MINE MASTER` | 350 | +90 |

Sequence between promotions:

```text
50 → 60 → 70 → 80 → 90
```

Each rank uses one separate badge PNG.

Rank thresholds must exist in one configuration structure, not be duplicated as magic numbers across files.

### 11.1 Progress bar logic

The compact profile shows progress **within the current rank segment**, not `total Gems / 350`.

Example:

- total = 142;
- current rank = `GEM HUNTER` (starts at 110);
- next rank = `GOLD DIGGER` (180);
- progress display = `32 / 70 to GOLD DIGGER`.

At `GRAMMAR MINE MASTER`:

- no next-rank target is shown;
- use a full bar and a fixed max-rank label such as `MASTER RANK`.

---

## 12. Return-from-game reward animation

When a completed mini-game returns to the hub, do not silently replace the Gem total.

Use this sequence:

1. hub appears with the visually previous Gem total;
2. near the profile Gem counter show `ui_gem_icon.png + +N`, for example `💎 +18`;
3. play a short reward sound if audio is enabled;
4. animate the total Gem number from old to new;
5. pulse/highlight the Gem counter;
6. animate the progress bar to its new value;
7. fade/remove the temporary `+N`.

Suggested total duration:

- about 1–2 seconds.

The reward event must be one-time.

Do not replay it after normal refresh/navigation once it has been acknowledged.

---

## 13. Rank-up event

After the Gem/count/progress animation, compare the old and new ranks.

If no rank changed:

- return to normal hub state.

If a rank changed:

- open `modal_rank_up_bg.png`.

### 13.1 Rank Up popup content

The background asset contains:

- `RANK UP!` header;
- a large clean beige circular area in a thin gold frame.

Do **not** bake a specific badge or rank title into the background.

Layer by code:

- the newly earned badge PNG inside the large circle;
- the new rank title, e.g. `CAVE EXPLORER`;
- optional short congratulatory text;
- a real HTML/CSS `CONTINUE` / `AWESOME!` button.

The Rank Up popup:

- has no X;
- closes through its continue button;
- may use a short glow/spark particle effect;
- may play a short rank-up sound.

After close:

- the new badge is already active in the compact profile;
- progress now points toward the following rank.

---

## 14. Detailed profile modal

Clicking the compact profile opens `modal_profile_bg.png` over a dimmed hub.

### 14.1 Asset behaviour

The background asset keeps the approved layout and proportions from the final profile concept.

It contains:

- `MY MINER PROFILE` header;
- the four approved fixed stat icons/areas;
- three recent-session rows;
- empty icon slots at the start of each recent-session row;
- baked visual `BACK TO CAMP` button;
- **no baked X**;
- no dynamic avatar/name/Gem/rank/session text.

The close X is the separate `ui_close_button.png`.

The real clickable hit area for the baked `BACK TO CAMP` button is rendered by HTML/CSS over the visual button.

Both X and `BACK TO CAMP` close the modal and return to the normal hub view.

### 14.2 Profile summary

Render dynamically:

- avatar;
- player name;
- total Gems with `ui_gem_icon.png`;
- current rank badge;
- current rank title if needed;
- progress text;
- CSS progress bar.

### 14.3 Approved statistics

Exactly four primary stat tiles in v1:

1. `Games played`
2. `Correct answers`
3. `Ghosts defeated`
4. `Best Gold Rush`

The decorative icons for these four stat tiles remain baked into `modal_profile_bg.png`.

Dynamic numbers/text are rendered by code.

### 14.4 Recent sessions

Show the three most recent sessions.

Each row dynamically renders:

- session game icon;
- game name;
- grammar topic / activity where available;
- Gems earned.

Use the separate dynamic session icons:

- `session_icon_gold_rush.png`
- `session_icon_mine_cart.png`
- `session_icon_haunted_cave.png`

Do not bake fixed game icons into the three rows, because the player may play the same game several times in a row.

---

## 15. Local persistence

Use browser storage such as `localStorage`.

No backend/account system is required for v1.

The profile is local to the current browser/device.

Suggested conceptual model:

```js
const player = {
  name: "Anna",
  avatarId: "avatar_explorer",
  gems: 142,
  sessions: [],
  stats: {
    gamesPlayed: 0,
    correctAnswers: 0,
    ghostsDefeated: 0,
    bestGoldRushGems: 0
  },
  pendingHubReward: null
};
```

Prefer deriving the current rank from `gems` using one central rank configuration instead of trusting a duplicated stored rank value.

Example rank configuration:

```js
const RANKS = [
  { id: "rookie_miner", threshold: 0 },
  { id: "cave_explorer", threshold: 50 },
  { id: "gem_hunter", threshold: 110 },
  { id: "gold_digger", threshold: 180 },
  { id: "mine_expert", threshold: 260 },
  { id: "grammar_mine_master", threshold: 350 }
];
```

### 15.1 Pending hub reward

A completed mini-game appends a session and creates a one-time reward payload.

Example:

```js
pendingHubReward = {
  gameId: "grammar-gold-rush",
  gemsEarned: 18,
  previousGemTotal: 124,
  newGemTotal: 142,
  previousRankId: "cave_explorer",
  newRankId: "gem_hunter",
  acknowledged: false
};
```

After the hub has played the Gem animation and any Rank Up event:

- mark/clear the payload;
- do not replay it on refresh.

---

## 16. Session data

Each completed session should store enough information for the profile history.

Recommended shape:

```js
{
  id: "session-...",
  timestamp: "...",
  gameId: "grammar-gold-rush",
  gameName: "Grammar Gold Rush",
  topic: "Present Simple",
  gemsEarned: 18,
  correctAnswers: 12,
  attemptedAnswers: 15,
  ghostsDefeated: 1
}
```

Game-specific fields may be absent when they do not apply.

Only the three most recent sessions need to be displayed in the v1 profile modal, but more history may remain stored.

---

## 17. Navigation

### Hub → mini-game

Clicking any game card:

- saves required state;
- navigates to that mini-game.

### Mini-game → hub

`Back to Camp`:

- completes/saves the session;
- updates global stats;
- updates total Gems;
- creates `pendingHubReward`;
- returns to the showcase.

The showcase then runs:

```text
💎 +N
→ total Gems animation
→ progress animation
→ optional Rank Up popup
```

---

## 18. Interaction matrix

Interactive:

- compact profile;
- all three entire game cards;
- visible baked `PLAY` areas as part of those cards;
- onboarding input;
- six avatar choices;
- `START MINING!`;
- profile close X;
- profile `BACK TO CAMP`;
- Rank Up continue button.

Decorative / non-clickable in v1:

- project logo;
- hub hamster baked into background;
- progression signs baked into background;
- other environmental mine/camp scenery.

---

## 19. Modal rules

### Welcome

- blocks hub interaction;
- no X;
- no backdrop/Escape dismiss;
- only completed onboarding can continue.

### Profile

- hub dimmed behind;
- close X is separate asset;
- `BACK TO CAMP` also closes;
- backdrop click should not be required for closing.

### Rank Up

- hub dimmed behind;
- no X;
- closes via code-rendered continue button.

All modal interaction layers must be real HTML/CSS controls even where a visual button is baked into a PNG.

---

## 20. Accessibility / usability basics

- use semantic real controls/links where practical;
- maintain keyboard focus states;
- visible `PLAY` text remains even though full cards are clickable;
- large hit areas;
- readable text sizes;
- hover is enhanced feedback, not the only discoverability cue;
- support `prefers-reduced-motion` where practical.

---

## 21. Prototype scope

Implement in showcase v1:

- full-screen layout;
- approved hub composition;
- shared Gem/profile/rank system;
- exact 6-rank thresholds;
- 3 game cards;
- full-card click + hover arrow;
- compact dynamic profile;
- first-launch onboarding;
- 6 selectable avatars;
- localStorage persistence;
- profile modal;
- four primary statistics;
- dynamic three-row recent session history;
- one-time `+Gems` return animation;
- progress animation;
- Rank Up popup.

Do **not** invent unrelated mechanics such as:

- Daily Bonus;
- Shop;
- inventory;
- Backpack;
- Map;
- quest system;
- Achievements page;
- Settings panel;
- multiple currencies.

---

## 22. Recommended project placement

```text
docs/showcase/
├── HAMSTERS_GRAMMAR_MINE_Showcase_Spec.md
└── HAMSTERS_GRAMMAR_MINE_Showcase_Asset_Manifest.md
```

Recommended implementation:

```text
index.html

css/
└── site.css

js/
├── site.js
├── profile.js
├── progression.js
└── storage.js

assets/
└── shared/
    └── showcase/
        ├── background/
        ├── branding/
        ├── cards/
        ├── profile/
        ├── avatars/
        ├── badges/
        ├── popups/
        └── ui/
```

---

## 23. Source-of-truth hierarchy

For the showcase:

1. `HAMSTERS_GRAMMAR_MINE_Showcase_Spec.md` — behaviour and interaction;
2. `HAMSTERS_GRAMMAR_MINE_Showcase_Asset_Manifest.md` — exact production asset names, composition rules and dynamic/baked boundaries;
3. approved visual reference screenshots — visual direction and placement.

If an AI-generated concept contains mechanics not present in these documents, do **not** implement them.

If a popup concept contains dynamic example text/data, follow the manifest and render that content by code.

---

## 24. Short behavioural summary

```text
FIRST VISIT
Welcome modal
→ enter name
→ choose 1 of 6 avatars
→ Start Mining becomes enabled
→ create Rookie Miner profile
→ Hub

NORMAL HUB
Logo + integrated background hamster/signs
+ compact profile
+ featured Grammar Gold Rush
+ two Bonus games

GAME CARD HOVER
Scale + glow + circular arrow

PROFILE HOVER
Avatar scale + glow

RETURN FROM GAME
💎 +N
→ total count animation
→ progress animation
→ if rank threshold crossed:
   RANK UP!
   dynamic new badge + rank title

PROFILE CLICK
Profile modal
→ current player summary
→ 4 stats
→ 3 dynamic recent sessions
```

---

**End of showcase specification v1.1**
