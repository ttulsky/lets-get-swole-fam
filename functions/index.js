/* eslint-disable */
const functions = require("firebase-functions");
const axios = require("axios");
const cors = require("cors")({ origin: true });

// Load environment variables from .env file for local development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const FATSECRET_CLIENT_ID =
  process.env.FATSECRET_CLIENT_ID || functions.config().fatsecret.client_id;
const FATSECRET_CLIENT_SECRET =
  process.env.FATSECRET_CLIENT_SECRET ||
  functions.config().fatsecret.client_secret;
let ACCESS_TOKEN = "";

const getAccessToken = async () => {
  const tokenUrl = "https://oauth.fatsecret.com/connect/token";
  const data = new URLSearchParams({
    grant_type: "client_credentials",
    scope: "basic",
  });

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Basic ${Buffer.from(
      `${FATSECRET_CLIENT_ID}:${FATSECRET_CLIENT_SECRET}`
    ).toString("base64")}`,
  };

  try {
    const response = await axios.post(tokenUrl, data, { headers });
    ACCESS_TOKEN = response.data.access_token;
  } catch (error) {
    console.error("Error obtaining access token:", error.message);
  }
};

getAccessToken();

exports.calories = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== "GET") {
      return res.status(405).send("Method Not Allowed");
    }

    const { query } = req.query;
    const requestData = {
      method: "GET",
      url: "https://platform.fatsecret.com/rest/server.api",
      params: {
        method: "foods.search",
        search_expression: query,
        format: "json",
      },
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios(requestData);
      res.status(200).json(response.data);
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  });
});
