# Lobox — Multi Select Assignment

React + TypeScript + SCSS project implementing a reusable multi-select component.

## Goals & highlights

- Reusable multi-select component implemented in React + TypeScript.
- Controlled API using `value` and `onChange`.
- Supports creating new items via the input (press `Enter`).
- Closes when clicking outside the component.
- Component-level SCSS for styling.

## Component behavior

- **Multi-select** — selected items appear as tags.
- **Add new items** — typing a label and pressing `Enter` creates and selects it.
- **Search** — options list is filtered while typing.
- **Remove tags** — each selected item has a remove button.
- **Overflow handling** — shows up to three tags and a `+N more` badge with a tooltip.

## Styling

- Component is styled with SCSS.
- Global color variables and base styles live under `src/styles/`.
- Font Awesome is used for small icons (chevron, remove, check).

## How to run

1. Install:
   ```sh
   npm install
   ```
2. Dev:
   ```sh
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.
