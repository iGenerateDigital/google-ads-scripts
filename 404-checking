function main() {
  var it = AdsApp.ads().get();
  while (it.hasNext()) {
    var ad = it.next();
    var url = ad.urls().getFinalUrl();
    var responseCode = UrlFetchApp.fetch(url).getResponseCode();
    if (responseCode === 404) {
      ad.pause();
      Logger.log('Ad with headline "' + ad.getHeadline() + '" leads to a broken URL: ' + url);
    }
  }
}
