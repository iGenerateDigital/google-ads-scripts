function main() {
  var adGroupIterator = AdsApp.adGroups()
      .withCondition('Name = "YOUR_ADGROUP_NAME"') // Replace with your ad group's name
      .get();
  
  if (adGroupIterator.hasNext()) {
    var adGroup = adGroupIterator.next();
    
    var adIterator = adGroup.ads().get();
    var adArray = [];
    
    while (adIterator.hasNext()) {
      adArray.push(adIterator.next());
    }
    
    if (adArray.length != 2) {
      Logger.log("Ad group doesn't contain exactly two ads. Please adjust.");
      return;
    }
    
    var date = new Date();
    if (date.getDate() % 2 == 0) {
      adArray[0].enable();
      adArray[1].pause();
    } else {
      adArray[0].pause();
      adArray[1].enable();
    }
  }
}
