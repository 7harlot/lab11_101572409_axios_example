# lab11_101572409_axios_example – COMP 3123 Lab 11 (Axios + Fetch API)

Student ID: 101572409

A Create React App project that loads 10 random users from
`https://randomuser.me/api/?results=10` and shows them as a **User List**,
matching the handout's output format (green banner, teal card per user,
round photo, Details button, label/value rows).

- **Step 3 (axios):** `PersonList` is a class component with `state = { persons: [] }`
  and `componentDidMount()`, exactly like the handout's reference code.
- Requests time out after 10 seconds (axios `timeout` option, fetch `AbortController`), so a dead network shows an error instead of spinning forever.
- **Step 4 (fetch):** the same data loaded with the browser's built-in `fetch`.
  Use the **Load with: axios / fetch API** toggle at the top right to switch.

## Run it

```bash
npm install     # node_modules is not in the ZIP or the repo
npm start       # opens http://localhost:3000 (needs internet for randomuser.me)
npm test        # 10 Jest + React Testing Library tests (no internet needed, API is mocked)
```

## How it works

| File | Job |
| --- | --- |
| `src/services/randomUserApi.js` | Talks to randomuser.me. `fetchPersonsWithAxios` and `fetchPersonsWithFetch` both return a plain array of people, so the UI doesn't care which one ran. |
| `src/components/PersonList.js` | The lab's component. Loads users on mount, reloads when the toggle changes, shows a spinner while loading and an alert with **Try again** on errors. |
| `src/components/PersonCard.js` | Draws one user in the handout layout. **Details** opens extra info (nationality, coordinates, years as member). |
| `src/App.js` | Green "User List" banner + the axios/fetch toggle. |
| `src/App.test.js` | Tests both clients, the StrictMode double-mount, the 10 s timeout, the card format, HTTP/network/malformed-response errors, the Details toggle, and the helpers. |

### axios vs fetch: the two differences that matter

| | axios | fetch |
| --- | --- | --- |
| JSON parsing | automatic (`res.data`) | manual (`await response.json()`) |
| HTTP 404 / 500 | rejects the promise (lands in `catch`) | **does not reject**, you must check `response.ok` |
| Install | `npm install axios` | built into the browser |

Both log the raw response with `console.log` (open DevTools → Console to see it).

## Screenshots

`screenshots/preview-*.png` were taken with sample data (randomuser.me is blocked
where they were generated), so the photos are placeholder initials. For the BB
submission, take a screenshot of `npm start` on your own machine, which shows real users.
