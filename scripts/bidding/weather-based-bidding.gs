/**
 * @name Weather-Based Bidding
 * @overview Updates campaign labels and budgets based on current weather.
 * @author Web Lifter <open-source@weblifter.com.au>
 * @version 1.0.0
 * @license MIT
 * @configuration
 *   - CAMPAIGN_NAME: Campaign to update (line 16)
 *   - OPEN_WEATHER_API_KEY: API key from OpenWeather (line 17)
 *   - CITY_NAME: City used for weather lookups (line 18)
 *   - BUDGETS: Budget amounts by weather (line 19)
 *   - DRY_RUN: When true, no changes are applied (line 20)
 * @prerequisites
 *   - OpenWeather API key
 *   - Campaign uses an editable budget
 * @schedule Daily
 */
function main() {
  // === CONFIGURATION ===
  var CAMPAIGN_NAME = "YOUR_CAMPAIGN_NAME";
  var OPEN_WEATHER_API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";
  var CITY_NAME = "YOUR_CITY_NAME";
  var BUDGETS = {
    Rain: 500,
    Clear: 300,
    Other: 100
  };
  var DRY_RUN = true;
  // === END CONFIGURATION ===

  var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + encodeURIComponent(CITY_NAME) + "&appid=" + OPEN_WEATHER_API_KEY;
  var response = null;

  try {
    response = UrlFetchApp.fetch(weatherUrl, { muteHttpExceptions: true });
  } catch (e) {
    Logger.log("Weather API request failed: " + e);
    return;
  }

  if (response.getResponseCode() !== 200) {
    Logger.log("Weather API returned status " + response.getResponseCode());
    return;
  }

  var payload = JSON.parse(response.getContentText());
  var weatherCondition = payload.weather && payload.weather.length ? payload.weather[0].main : "Other";

  var campaignIterator = AdsApp.campaigns()
    .withCondition('Name = "' + CAMPAIGN_NAME + '"')
    .get();

  if (!campaignIterator.hasNext()) {
    Logger.log("No campaign found with name: " + CAMPAIGN_NAME);
    return;
  }

  var campaign = campaignIterator.next();
  var labelName = weatherCondition === "Rain" ? "Rainy Weather" : weatherCondition === "Clear" ? "Clear Weather" : "Other Weather";
  var budgetAmount = weatherCondition === "Rain" ? BUDGETS.Rain : weatherCondition === "Clear" ? BUDGETS.Clear : BUDGETS.Other;

  ensureLabel(labelName);

  if (DRY_RUN) {
    Logger.log("[Dry Run] Would apply label '" + labelName + "' and set budget to " + budgetAmount + " for campaign '" + campaign.getName() + "'.");
    return;
  }

  campaign.applyLabel(labelName);
  campaign.getBudget().setAmount(budgetAmount);
}

function ensureLabel(labelName) {
  var labelIterator = AdsApp.labels().withCondition('Name = "' + labelName + '"').get();
  if (!labelIterator.hasNext()) {
    AdsApp.createLabel(labelName);
  }
}
