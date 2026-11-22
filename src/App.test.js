// App.test.js – checks the user list with axios AND fetch, without the internet.
import { StrictMode } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import App from './App';
import PersonList from './components/PersonList';
import { formatAddress } from './components/PersonCard';
import { buildRandomUserUrl } from './services/randomUserApi';
import { samplePersons } from './testData/samplePersons';

jest.mock('axios');

// Helper: make global fetch answer like the real API would.
function mockFetchResponse({ ok = true, status = 200, body }) {
  global.fetch = jest.fn().mockResolvedValue({ ok, status, json: async () => body });
}

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  axios.get.mockResolvedValue({ data: { results: samplePersons } });
});

afterEach(() => {
  jest.restoreAllMocks();
  delete global.fetch;
});

test('axios: requests 10 users and renders a card per user', async () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'User List' })).toBeInTheDocument();
  expect(screen.getByText(/loading users/i)).toBeInTheDocument();

  expect(await screen.findAllByTestId('person-card')).toHaveLength(2);
  expect(axios.get).toHaveBeenCalledWith('https://randomuser.me/api/?results=10', { timeout: 10000 });
});

// Regression: StrictMode (used in src/index.js) mounts, unmounts, then
// re-mounts in development. This used to leave the spinner up forever.
test('StrictMode: users still render after the dev double-mount', async () => {
  render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  expect(await screen.findAllByTestId('person-card')).toHaveLength(2);
});

test('card shows the handout fields in the handout format', async () => {
  render(<PersonList />);
  const [firstCard] = await screen.findAllByTestId('person-card');
  const card = within(firstCard);

  expect(card.getByText('Miss Eliza Moore - 491a78ec-7494-4c8c-8da1-731102e13a17')).toBeInTheDocument();
  expect(card.getByText('bigladybug274')).toBeInTheDocument();
  expect(card.getByText('FEMALE')).toBeInTheDocument();
  expect(card.getByText('Abu Dhabi, Muscat, Baku, Tbilisi')).toBeInTheDocument();
  expect(card.getByText('4638 North Street, Truro, South Glamorgan, United Kingdom - LP5 6QN')).toBeInTheDocument();
  expect(card.getByText('1948-09-02T18:41:36.832Z (72)')).toBeInTheDocument();
  expect(card.getByText('0708-312-222')).toBeInTheDocument();
  expect(card.getByRole('img', { name: /portrait of eliza moore/i })).toHaveAttribute(
    'src',
    'https://randomuser.me/api/portraits/women/1.jpg'
  );
});

test('fetch: switching the toggle reloads users with the Fetch API', async () => {
  mockFetchResponse({ body: { results: [samplePersons[1]] } });
  render(<App />);
  await screen.findAllByTestId('person-card');

  await userEvent.click(screen.getByLabelText('fetch API'));

  expect(await screen.findByText(/Ms Sarah Johnson/)).toBeInTheDocument();
  expect(screen.getAllByTestId('person-card')).toHaveLength(1);
  expect(global.fetch).toHaveBeenCalledWith(
    'https://randomuser.me/api/?results=10',
    expect.objectContaining({ signal: expect.any(Object) })
  );
});

test('fetch: a non-2xx status shows an error instead of crashing', async () => {
  mockFetchResponse({ ok: false, status: 503, body: {} });
  render(<PersonList httpClient="fetch" />);
  expect(await screen.findByText('randomuser.me responded with HTTP 503')).toBeInTheDocument();
});

test('fetch: a request that never answers times out with a readable error', async () => {
  jest.useFakeTimers();
  global.fetch = jest.fn((url, { signal }) =>
    new Promise((resolve, reject) => {
      signal.addEventListener('abort', () =>
        reject(Object.assign(new Error('aborted'), { name: 'AbortError' }))
      );
    })
  );
  render(<PersonList httpClient="fetch" />);
  jest.advanceTimersByTime(10000);
  jest.useRealTimers();
  expect(await screen.findByText(/did not answer within 10 seconds/)).toBeInTheDocument();
});

test('axios: network error shows an alert and "Try again" recovers', async () => {
  axios.get.mockRejectedValueOnce(new Error('Network Error'));
  render(<PersonList />);
  expect(await screen.findByText('Network Error')).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: /try again/i }));
  expect(await screen.findAllByTestId('person-card')).toHaveLength(2);
});

test('malformed response (no results array) shows a readable error', async () => {
  axios.get.mockResolvedValueOnce({ data: { error: 'Uh oh' } });
  render(<PersonList />);
  expect(await screen.findByText(/no "results" array/)).toBeInTheDocument();
});

test('Details button toggles the extra info panel', async () => {
  render(<PersonList />);
  const [firstCard] = await screen.findAllByTestId('person-card');
  const detailsButton = within(firstCard).getByRole('button', { name: 'Details' });

  expect(detailsButton).toHaveAttribute('aria-expanded', 'false');
  await userEvent.click(detailsButton);
  expect(within(firstCard).getByRole('button', { name: 'Hide' })).toHaveAttribute('aria-expanded', 'true');
  expect(within(firstCard).getByText('GB')).toBeInTheDocument();
});

test('helpers: URL builder and address formatter handle edge cases', () => {
  expect(buildRandomUserUrl(3)).toBe('https://randomuser.me/api/?results=3');
  expect(formatAddress({})).toBe('');
  expect(formatAddress({ city: 'Toronto', country: 'Canada' })).toBe('Toronto, Canada');
});
