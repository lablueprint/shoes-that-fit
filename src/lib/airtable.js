import Airtable from '@calblueprint/airlock';

const BASE_ID = process.env.REACT_APP_AIRTABLE_BASE_KEY;
const API_KEY = process.env.REACT_APP_AIRTABLE_USER_KEY;
const ENDPOINT_URL = 'http://localhost:8000';

Airtable.configure({
  endpointUrl: ENDPOINT_URL,
  apiKey: API_KEY,
});

const base = Airtable.base(BASE_ID);
export default base;
