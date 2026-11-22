// PersonList.js
// ---------------------------------------------------------------------------
// The component the lab asks for. It is a CLASS component on purpose, because
// the handout's reference code uses `state = { persons: [] }` and
// `componentDidMount()`. We keep that shape and add the two things the
// reference skips: a loading state and error handling.
//
// Props:
//   httpClient   "axios" (default, step 3) or "fetch" (step 4)
//   resultCount  how many users to load (default 10, same as the handout)
// ---------------------------------------------------------------------------
import React, { Component } from 'react';
import { Alert, Button, Spinner } from 'react-bootstrap';
import PersonCard from './PersonCard';
import { DEFAULT_RESULT_COUNT, httpClients } from '../services/randomUserApi';

class PersonList extends Component {
  // Define state default values (from the handout, plus loading/error).
  state = {
    persons: [],
    isLoading: true,
    errorMessage: '',
  };

  // Component Lifecycle Callback: runs after the first render.
  // In development, React StrictMode deliberately runs
  // mount -> unmount -> mount on the SAME instance to catch bugs, so we must
  // reset the "unmounted" flag here or every response gets ignored forever.
  componentDidMount() {
    this.isUnmounted = false;
    this.loadPersons();
  }

  // When the user flips between axios and fetch, load again with the new tool.
  componentDidUpdate(previousProps) {
    if (previousProps.httpClient !== this.props.httpClient) {
      this.loadPersons();
    }
  }

  // If the component disappears mid-request, don't call setState on it.
  componentWillUnmount() {
    this.isUnmounted = true;
  }

  loadPersons = async () => {
    const { httpClient = 'axios', resultCount = DEFAULT_RESULT_COUNT } = this.props;
    const fetchPersons = httpClients[httpClient] || httpClients.axios;

    // Each request gets a number. If the user clicks "Reload" twice fast,
    // only the newest request is allowed to update the screen.
    const requestNumber = (this.latestRequestNumber = (this.latestRequestNumber || 0) + 1);
    this.setState({ isLoading: true, errorMessage: '' });

    try {
      const persons = await fetchPersons(resultCount);
      if (this.isUnmounted || requestNumber !== this.latestRequestNumber) return;
      this.setState({ persons, isLoading: false });
    } catch (error) {
      if (this.isUnmounted || requestNumber !== this.latestRequestNumber) return;
      console.error(`[${httpClient}] failed to load users:`, error);
      this.setState({
        persons: [],
        isLoading: false,
        errorMessage: error.message || 'Could not load users.',
      });
    }
  };

  render() {
    const { persons, isLoading, errorMessage } = this.state;

    if (isLoading) {
      return (
        <div className="text-center my-5" role="status">
          <Spinner animation="border" variant="success" />
          <p className="mt-2">Loading users...</p>
        </div>
      );
    }

    if (errorMessage) {
      return (
        <Alert variant="danger" className="m-3">
          <Alert.Heading>Could not load users</Alert.Heading>
          <p>{errorMessage}</p>
          <Button variant="outline-danger" onClick={this.loadPersons}>
            Try again
          </Button>
        </Alert>
      );
    }

    return (
      <div className="px-3">
        {persons.map((person) => (
          // login.uuid is unique per user, so it makes a stable React key.
          <PersonCard key={person.login.uuid} person={person} />
        ))}
      </div>
    );
  }
}

export default PersonList;
