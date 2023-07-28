function main() {
  var campaignName = "YOUR_CAMPAIGN_NAME"; // Replace with your campaign's name
  var openWeatherMapApiKey = "YOUR_OPENWEATHERMAP_API_KEY"; // Get an API Key from OpenWeatherMap
  var cityName = "YOUR_CITY_NAME"; // Replace with the city name where your campaign is focused
  
  // Fetch the current weather data
  var weatherUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + openWeatherMapApiKey;
  var weatherResponse = UrlFetchApp.fetch(weatherUrl);
  var weatherJson = JSON.parse(weatherResponse.getContentText());
  var weatherCondition = weatherJson.weather[0].main; // This gets the main weather condition (Rain, Clear, Clouds, etc.)

  // Get the campaign
  var campaignIterator = AdsApp.campaigns()
      .withCondition('Name = "' + campaignName + '"')
      .get();
  if (campaignIterator.hasNext()) {
    var campaign = campaignIterator.next();

    if (weatherCondition === 'Rain') {
      campaign.applyLabel('Rainy Weather');
      campaign.getBudget().setAmount(500); // Set the budget amount suitable to you
    } else if (weatherCondition === 'Clear') {
      campaign.applyLabel('Clear Weather');
      campaign.getBudget().setAmount(300); // Set the budget amount suitable to you
    } else {
      campaign.applyLabel('Other Weather');
      campaign.getBudget().setAmount(100); // Set the budget amount suitable to you
    }
  }
}
