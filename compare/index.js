const axios = require("axios");

// ================= CONFIGURATION =================
const INPUT_URL = "https://www.amazon.in/Google-Pixel-10-Frost-Storage/dp/B0FNP9KVFC/ref=sr_1_1";

// ⚠️ API KEYS
// You need a RapidAPI Key. The one below is your provided key.
// Ensure you are subscribed to "Google Shopping API" on RapidAPI for the second part to work.
const RAPIDAPI_KEY = "491b3aa096mshb07c4b69816ee92p1ef546jsn764b0a4a19c7";

// ================= STEP 1: GET PRODUCT NAME =================
// We use your existing Amazon logic just to find out the exact product name.

async function getProductNameFromUrl(url) {
  // 1. Extract ASIN
  const match = url.match(/\/dp\/([A-Z0-9]{10})|\/gp\/product\/([A-Z0-9]{10})/);
  const asin = match ? (match[1] || match[2]) : null;

  if (!asin) throw new Error("Invalid Amazon URL");

  // 2. Fetch details from Amazon API
  const options = {
    method: "GET",
    url: "https://real-time-amazon-data.p.rapidapi.com/product-details",
    params: { asin: asin, country: "IN" },
    headers: {
      "X-RapidAPI-Key": RAPIDAPI_KEY,
      "X-RapidAPI-Host": "real-time-amazon-data.p.rapidapi.com"
    }
  };

  try {
    const response = await axios.request(options);
    return response.data.data.product_title;
  } catch (error) {
    console.error("Could not fetch product name:", error.message);
    throw error;
  }
}

// ================= STEP 2: SEARCH ALL STORES (SINGLE API) =================
// This function uses Google Shopping API to find this product on EVERY store.

async function fetchPricesFromAllStores(productName) {
  console.log(`\n🔎 Searching Google Shopping for: "${productName}"...\n`);

  const options = {
    method: "GET",
    url: "https://google-shopping-api.p.rapidapi.com/search", // This is the "Single API"
    params: {
      q: productName, // The product name we found
      country: "in",  // Country code (India)
      language: "en",
      api_key: "YOUR_GOOGLE_SHOPPING_API_KEY" // Some require this, some use headers
    },
    headers: {
      "X-RapidAPI-Key": RAPIDAPI_KEY,
      "X-RapidAPI-Host": "google-shopping-api.p.rapidapi.com"
    }
  };

  try {
    const response = await axios.request(options);
    
    // Google returns a list of stores selling this product
    const stores = response.data.shopping_results; 

    if (!stores || stores.length === 0) {
      console.log("❌ No other stores found selling this product.");
      return;
    }

    // ================= DISPLAY RESULTS =================
    console.log("============ 📊 PRICE COMPARISON (ALL STORES) ============\n");
    console.log(
      "Store Name".padEnd(25) + 
      "Price".padEnd(15) + 
      "Delivery".padEnd(15) + 
      "Source"
    );
    console.log("-----------------------------------------------------------");

    stores.forEach((item) => {
      const storeName = item.source || "Unknown Store";
      const price = item.extracted_price ? `₹${item.extracted_price}` : "N/A";
      const delivery = item.delivery || "Check Site";
      
      console.log(
        storeName.substring(0, 20).padEnd(25) + 
        price.padEnd(15) + 
        delivery.toString().substring(0, 12).padEnd(15) + 
        "Link"
      );
    });

    console.log("-----------------------------------------------------------");
    console.log(`✅ Found ${stores.length} stores.`);

  } catch (error) {
    // If the Google API call fails (e.g., wrong key or not subscribed)
    console.error("❌ Error fetching from Google Shopping:", error.response ? error.response.data : error.message);
    console.log("\n⚠️ NOTE: Make sure you are subscribed to 'Google Shopping API' on RapidAPI to enable multi-store search.");
  }
}

// ================= MAIN EXECUTION =================

(async () => {
  try {
    // 1. Get Name from Input URL
    const productName = await getProductNameFromUrl(INPUT_URL);
    
    // 2. Use Single API to get all stores
    await fetchPricesFromAllStores(productName);

  } catch (err) {
    console.error("Script failed:", err.message);
  }
})();