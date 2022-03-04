import Airtable from '@calblueprint/airlock';

const BASE_ID = process.env.REACT_APP_AIRTABLE_BASE_ID;
const API_KEY = process.env.REACT_APP_AIRTABLE_API_KEY;
const ENDPOINT_URL = 'http://localhost:8000';

Airtable.configure({
  endpointUrl: ENDPOINT_URL,
  apiKey: API_KEY,
});

const base = Airtable.base(BASE_ID);
export default base;
