function main() {
  var adIterator = AdsApp.ads()
    .withCondition("Status = ENABLED")
    .withCondition("AdGroupStatus = ENABLED")
    .withCondition("CampaignStatus = ENABLED")
    .get();

  while (adIterator.hasNext()) {
    var ad = adIterator.next();
    var url = ad.urls().getFinalUrl();

    if (url) {
      var responseCode;
      try {
        responseCode = UrlFetchApp.fetch(url).getResponseCode();
      } catch (e) {
        responseCode = -1;
      }
      
      if (responseCode !== 200) {
        Logger.log("URL '" + url + "' in ad '" + ad.getHeadline() + "' returned status code " + responseCode + ".");
      }
    }
  }
}
