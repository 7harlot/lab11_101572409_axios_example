// samplePersons.js – fake randomuser.me users for tests (no network needed).
// Shape copied from a real https://randomuser.me/api/ response.
export function makeSamplePerson(overrides = {}) {
  return {
    gender: 'female',
    name: { title: 'Miss', first: 'Eliza', last: 'Moore' },
    location: {
      street: { number: 4638, name: 'North Street' },
      city: 'Truro',
      state: 'South Glamorgan',
      country: 'United Kingdom',
      postcode: 'LP5 6QN',
      coordinates: { latitude: '-12.3', longitude: '45.6' },
      timezone: { offset: '+4:00', description: 'Abu Dhabi, Muscat, Baku, Tbilisi' },
    },
    email: 'eliza.moore@example.com',
    login: { uuid: '491a78ec-7494-4c8c-8da1-731102e13a17', username: 'bigladybug274' },
    dob: { date: '1948-09-02T18:41:36.832Z', age: 72 },
    registered: { date: '2004-05-05T09:52:39.914Z', age: 16 },
    phone: '017684 73458',
    cell: '0708-312-222',
    picture: { large: 'https://randomuser.me/api/portraits/women/1.jpg' },
    nat: 'GB',
    ...overrides,
  };
}

export const samplePersons = [
  makeSamplePerson(),
  makeSamplePerson({
    name: { title: 'Ms', first: 'Sarah', last: 'Johnson' },
    login: { uuid: 'd61b8615-64f5-4eb3-9e1e-31bc06256eda', username: 'silverswan537' },
    email: 'sarah.johnson@example.com',
  }),
];
