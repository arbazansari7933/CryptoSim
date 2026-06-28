import axios from "axios";

let USD_INR = 94; // Fallback

export async function updateExchangeRate() {
  try {
    const { data } = await axios.get(
      "https://open.er-api.com/v6/latest/USD"
    );

    USD_INR = data.rates.INR;

    console.log("USD/INR:", USD_INR);
  } catch (err) {
    console.error("Exchange Rate Error:", err.message);
  }
}

export function getExchangeRate() {
  return USD_INR;
}