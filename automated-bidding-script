function main() {
  var HOUR_TO_BID_MODIFIER = {
    0: -0.50,
    1: -0.50,
    // ... Add all 24 hours here
    23: -0.50
  };

  var currentHour = new Date().getHours();
  var modifier = HOUR_TO_BID_MODIFIER[currentHour];

  var campaignIterator = AdsApp.campaigns().get();
  while (campaignIterator.hasNext()) {
    var campaign = campaignIterator.next();
    campaign.bidding().setStrategy('MANUAL_CPC');
    campaign.bidding().setCpcBidModifier(modifier);
  }
}
