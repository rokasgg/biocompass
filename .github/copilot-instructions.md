Purpose
-------
This file gives actionable, repository-specific instructions to AI coding agents so they can be productive immediately in this Expo + React Native TypeScript app.

Quick project snapshot
----------------------
- App type: Expo React Native application. Entry: [index.ts](index.ts) -> [App.tsx](App.tsx).
- State: `zustand` with persistence to `AsyncStorage` in [src/store/useStore.ts](src/store/useStore.ts) (persist key: `app-storage`).
- UI: small component tree under `src/compoments` (note spelling) — example: [src/compoments/CustomButton.tsx](src/compoments/CustomButton.tsx).
- Packaging: TypeScript + Expo. See [package.json](package.json) for scripts and deps.

What to inspect first (order matters)
-----------------------------------
1. [package.json](package.json) — confirm scripts: `npm start`, `npm run ios`, `npm run android`, `npm run web` (runs `expo start`).
2. [index.ts](index.ts) and [App.tsx](App.tsx) — app entry and top-level layout.
3. [src/store/useStore.ts](src/store/useStore.ts) — global state shape and persistence; follow existing `persist` + `createJSONStorage` pattern.
4. UI components in `src/compoments` — note the folder is spelled `compoments`. Do not rename without coordinating a bulk change.
5. `src/hooks`, `src/screens`, and `src/utils` for cross-cutting patterns.

Project-specific conventions and gotchas
-------------------------------------
- Folder name typo: the components folder is `src/compoments`. Use that exact path in imports until a coordinated refactor.
- State pattern: `useStore` returns primitive state and actions (e.g., `count` and `inc`). Persisted storage key is `app-storage` — avoid changing it unless migrating data.
- Exports: components use named exports (e.g., `export const CustomButton`). Prefer matching the existing style.
- Styling: components use `StyleSheet.create` (React Native inline styles). Keep style objects colocated with components unless a shared style is needed.
- React Query: `@tanstack/react-query` is present in dependencies but not yet wired; if adding data fetching, follow React Query conventions and add a top-level QueryClient provider near `App.tsx`.

Build / run / debug
-------------------
- Start development: `npm start` (runs Expo). For device testing use Expo Go or a simulator.
- Platform runs: `npm run ios` / `npm run android` / `npm run web`.
- Type checking: `typescript` is a dev dependency; run `npx tsc --noEmit` if you need to check types explicitly.

Integration points & external deps
---------------------------------
- `@react-native-async-storage/async-storage` — used by zustand persistence in [src/store/useStore.ts](src/store/useStore.ts).
- `zustand` — primary client state manager.
- `@tanstack/react-query` — available for adding server state; not currently integrated.
- `expo` — runtime; most native capabilities should go through Expo APIs.

When making changes
-------------------
- Small, focused PRs. Don't rename `src/compoments` without a coordinated repo-wide rename (imports break otherwise).
- Preserve `useStore` persistence key or provide a clear migration step.
- If adding React Query, initialize `QueryClientProvider` at the app root and add hooks under `src/hooks`.

Examples (reference snippets)
-----------------------------
- Component: [src/compoments/CustomButton.tsx](src/compoments/CustomButton.tsx) — variant prop pattern and use of `StyleSheet`.
- Store: [src/store/useStore.ts](src/store/useStore.ts) — `persist((set) => ({ count: 0, inc: () => set(s => ({ count: s.count + 1 })) }), { name: 'app-storage' })`.

What agents should not do autonomously
-------------------------------------
- Do not rename `compoments` to `components` without explicit approval.
- Do not change the persistent storage key or storage mechanism without a migration plan.

If anything is unclear
----------------------
Ask the human maintainer which of the following they prefer before large changes: renaming the components folder, migrating persisted keys, or adding a global provider (React Query). Also confirm any intended routing/navigation strategy if you add `react-navigation`.

End.
