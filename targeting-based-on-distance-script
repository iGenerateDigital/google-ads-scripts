function main() {
    var campaignIterator = AdsApp.campaigns()
      .withCondition('Name = "Your Campaign Name"') // replace with your campaign's name
      .get();
  
    if (campaignIterator.hasNext()) {
        var campaign = campaignIterator.next();
        // set a higher bid modifier for closer radius
        campaign.targeting().newProximity()
            .radius(5, "MILES")
            .bidModifier(1.2);

        // set a lower bid modifier for larger radius
        campaign.targeting().newProximity()
            .radius(20, "MILES")
            .bidModifier(0.8);
    }
}
