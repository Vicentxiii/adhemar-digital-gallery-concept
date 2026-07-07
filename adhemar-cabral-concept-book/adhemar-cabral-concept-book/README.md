# Adhemar Cabral — Creative Direction Proposal
### A digital concept book, not a website.

Ten chapters, one continuous scroll. Built to be presented to the client as the thinking behind the future site — not the site itself.

## Files

```
adhemar-cabral-concept-book/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
└── README.md
```

No build step. No dependencies beyond two Google Fonts. Pure HTML5, CSS3, vanilla JavaScript.

## Open it in VSCode

1. Open the folder in VSCode.
2. Install the **Live Server** extension if you don't have it.
3. Right-click `index.html` → **Open with Live Server**.

## Deploy to Vercel

```bash
npm i -g vercel
cd adhemar-cabral-concept-book
vercel
```
Or drag the folder directly into [vercel.com/new](https://vercel.com/new). It's a static site — no framework, no build command needed.

## What's inside each chapter

| # | Chapter | Idea |
|---|---------|------|
| I | Opening | Full black screen, the name, one line, silence |
| II | Manifesto | The thesis, stated once, in full |
| III | The Vision | Philosophy in prose, then the ten words that guide it |
| IV | Moodboard | Six asymmetric plates — luxury, architecture, museums, sculpture, light, material |
| V | Visual Language | Palette, type specimen, spacing scale, interaction principle |
| VI | User Journey | Seven-step cinematic storyboard: arrival to contact |
| VII | Wireframe Concepts | Three abstract line-wireframes, not screenshots |
| VIII | Creative Principles | Three standalone statements |
| IX | Next Steps | A five-phase timeline: research to launch |
| X | Closing | One line. Full black. End. |

## The signature element

A vertical rail on the right edge (desktop) marks all ten chapters in Roman numerals. It's both the book's spine and the gallery's room index — the current chapter lights up in the accent gold as you scroll, and clicking a numeral jumps there directly. On small screens it becomes a single hairline progress line across the top, so the idea survives without cluttering a narrow viewport.

## Technical notes

- **Reveal on scroll**: handled by `IntersectionObserver` in `main.js`. Elements with `.reveal-io` fade up once, the first time they enter the viewport.
- **Opening sequence**: the cover chapter uses a separate `.reveal` animation, timed on page load via the `--d` CSS variable — no JS needed for that part.
- **Preloader**: a one-second pause on a plain black screen before the cover appears, like a book closing before it opens. Skipped entirely if the visitor has reduced motion enabled.
- **Reduced motion**: every animation and transition is disabled under `prefers-reduced-motion: reduce`; content simply appears.
- **Accent color** (`#B08D57`): used in exactly three places — the rail's active numeral, the spacing-scale bars, and the timeline numerals. Nowhere else.

## A note on the moodboard

The six plates are built from CSS gradients in tones drawn from the same palette — no stock photography, no placeholder icons. When real photography is ready, each `.plate` background can be swapped for an `<img>` or `background-image` without touching the layout.
