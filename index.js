#!/usr/bin/env node
require('dotenv').config(); 
const axios = require('axios');

// Get API keys from environment variables or arguments
const SOURCE_API_KEY = process.env.SOURCE_API_KEY;
const DESTINATION_API_KEY = process.env.DESTINATION_API_KEY;
const CREATOR_ID = process.env.CREATOR_ID
const STATSIG_API_URL = 'https://statsigapi.net/console/v1';

const HEADER_NAME = 'statsig-api-key'

// Function to copy configs from source to destination
async function copyConfigs() {
  try {
    const sourceGatesResponse = await axios.get(`${STATSIG_API_URL}/gates`, {
      headers: {
        [HEADER_NAME]: SOURCE_API_KEY,
      },
    });
    const gates = sourceGatesResponse.data.data;
    console.log('gates', gates)

    for (const gate of gates) {
      const { id: gateId, name: gateName } = gate;
      console.log(`Copying gate: ${gateName} (${gateId})`);

      const newGate = {...gate, creatorID: CREATOR_ID}

      const response = await axios.post(`${STATSIG_API_URL}/gates`, newGate, {
        headers: {
          [HEADER_NAME]: DESTINATION_API_KEY,
          'Content-Type': 'application/json',
        },
      });

      console.log(`Response: ${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error copying gates:', error.response ? error.response.data : error.message);
  }
}

// Execute the function
copyConfigs();
