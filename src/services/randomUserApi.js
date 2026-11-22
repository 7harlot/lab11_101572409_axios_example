// randomUserApi.js
// ---------------------------------------------------------------------------
// One place that talks to https://randomuser.me. The lab asks for two ways to
// get data (step 3: axios, step 4: JS fetch), so this file exposes BOTH,
// and they return the exact same thing: a plain array of person objects.
// That way PersonList never cares which HTTP tool was used.
// ---------------------------------------------------------------------------
import axios from 'axios';

export const RANDOM_USER_URL = 'https://randomuser.me/api/';
export const DEFAULT_RESULT_COUNT = 10;
// Give up after 10 s so a dead network shows an error instead of spinning forever.
export const REQUEST_TIMEOUT_MS = 10000;

// Builds "https://randomuser.me/api/?results=10" without string-gluing bugs.
export function buildRandomUserUrl(resultCount = DEFAULT_RESULT_COUNT) {
  const requestUrl = new URL(RANDOM_USER_URL);
  requestUrl.searchParams.set('results', String(resultCount));
  return requestUrl.toString();
}

// Guard: the API wraps people in { results: [...] }. If that shape is missing
// we throw a readable error instead of crashing later on `.map` of undefined.
function extractPersons(responseBody) {
  if (!responseBody || !Array.isArray(responseBody.results)) {
    throw new Error('Unexpected response from randomuser.me (no "results" array).');
  }
  return responseBody.results;
}

/**
 * Step 3 – axios version.
 * axios parses JSON for us (res.data) and REJECTS on any non-2xx status.
 * @param {number} resultCount how many users to ask for
 * @returns {Promise<object[]>} array of randomuser.me person objects
 */
export async function fetchPersonsWithAxios(resultCount = DEFAULT_RESULT_COUNT) {
  const res = await axios.get(buildRandomUserUrl(resultCount), {
    timeout: REQUEST_TIMEOUT_MS, // axios has a built-in timeout option
  });
  console.log('[axios] raw response data:', res.data); // same log as the handout
  return extractPersons(res.data);
}

/**
 * Step 4 – native fetch version.
 * Two gotchas vs axios, both handled here:
 *   1. fetch does NOT reject on 404/500, so we check `response.ok` ourselves.
 *   2. fetch does NOT parse JSON, so we call `response.json()`.
 * @param {number} resultCount how many users to ask for
 * @returns {Promise<object[]>} array of randomuser.me person objects
 */
export async function fetchPersonsWithFetch(resultCount = DEFAULT_RESULT_COUNT) {
  // fetch has no timeout option, so an AbortController cancels it for us.
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), REQUEST_TIMEOUT_MS);
  let response;
  try {
    response = await fetch(buildRandomUserUrl(resultCount), { signal: abortController.signal });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`randomuser.me did not answer within ${REQUEST_TIMEOUT_MS / 1000} seconds.`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
  if (!response.ok) {
    throw new Error(`randomuser.me responded with HTTP ${response.status}`);
  }
  const responseBody = await response.json();
  console.log('[fetch] raw response data:', responseBody);
  return extractPersons(responseBody);
}

// Lookup table so the UI can pick a client by name ("axios" | "fetch").
export const httpClients = {
  axios: fetchPersonsWithAxios,
  fetch: fetchPersonsWithFetch,
};
