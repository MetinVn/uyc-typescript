import { Handler } from "@netlify/functions";
import axios from "axios";

export const handler: Handler = async (event) => {
  const id = event.queryStringParameters?.id;

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing YouTube ID" }),
    };
  }

  try {
    console.log(
      "Is API Key loaded?:",
      process.env.RAPID_API_KEY ? "YES" : "NO",
    );
    const response = await axios.get("https://youtube-mp36.p.rapidapi.com/dl", {
      params: { id: id },
      headers: {
        "x-rapidapi-key": process.env.RAPID_API_KEY,
        "x-rapidapi-host": "youtube-mp36.p.rapidapi.com",
      },
    });

    return {
      statusCode: response.status,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error(
      "Full RapidAPI Error:",
      error.response?.data || error.message,
    );
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch from RapidAPI" }),
    };
  }
};
