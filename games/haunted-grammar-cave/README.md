# Haunted Grammar Cave — v1

Fast first prototype for HAMSTER'S GRAMMAR MINE.

## What is implemented
- Start screen: START + BACK + HOW TO PLAY.
- 5 Present Simple rounds.
- Flashlight follows the cursor; the light circle is generated in CSS (the PNG is only the flashlight body).
- Word stones are scattered in fixed safe positions and shuffled each round.
- Player clicks words in the correct order.
- Wrong next word -> ghost jump-scare animation, no score penalty.
- Complete sentence -> +1 Gem.
- HUD: Gems + task counter such as 2/5.
- Music / Help / Pause / Close controls.
- Final Level completed window + Play again / Back to camp.
- Result saved to localStorage under:
  - `hgm_haunted_cave_last_result`
  - `hgm_pending_minigame_result`

## Present Simple rounds
1. The hamster works in the mine.
2. She likes purple crystals.
3. Do you play games every day?
4. My brother doesn't like ghosts.
5. Where does the hamster live?

## Quick project integration
Recommended folder:
`games/haunted-grammar-cave/`

The Back/Close buttons first use browser history if the player came from the hub. Otherwise the fallback is `../../index.html`.

## One missing production asset
The approved separate Haunted Grammar Cave top logo was not in the supplied local asset batch, so v1 uses a code-rendered title in the same green/purple haunted style. Replace the `.code-logo` block with the approved logo PNG when it is available; no game logic needs to change.

## Audio
The music button is fully wired as a UI state toggle. No audio file was supplied, so v1 does not play sound yet.
