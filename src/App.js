// App.js
// ---------------------------------------------------------------------------
// Page shell: green "User List" banner (from the handout screenshot) plus a
// small toggle to switch between axios (step 3) and fetch (step 4).
// Changing the toggle re-renders PersonList with a new `httpClient` prop,
// which makes it load the users again with that tool.
// ---------------------------------------------------------------------------
import React, { useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import PersonList from './components/PersonList';
import './App.css';

const HTTP_CLIENT_OPTIONS = [
  { value: 'axios', label: 'axios' },
  { value: 'fetch', label: 'fetch API' },
];

export default function App() {
  const [httpClient, setHttpClient] = useState('axios');

  return (
    <div className="App">
      <header className="user-list-banner bg-success text-center py-3 mb-2">
        <h1 className="m-0">User List</h1>
      </header>

      <div className="d-flex justify-content-end align-items-center gap-2 px-3 mb-2">
        <span className="small text-muted">Load with:</span>
        <ToggleButtonGroup
          type="radio"
          name="httpClient"
          size="sm"
          value={httpClient}
          onChange={setHttpClient}
        >
          {HTTP_CLIENT_OPTIONS.map((option) => (
            <ToggleButton
              key={option.value}
              id={`client-${option.value}`}
              value={option.value}
              variant="outline-success"
            >
              {option.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>

      <PersonList httpClient={httpClient} />
    </div>
  );
}
