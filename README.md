# Google Ads Scripts

![License](https://img.shields.io/github/license/web-lifter/google-ads-scripts)
![Stars](https://img.shields.io/github/stars/web-lifter/google-ads-scripts)
![Issues](https://img.shields.io/github/issues/web-lifter/google-ads-scripts)
![Last Commit](https://img.shields.io/github/last-commit/web-lifter/google-ads-scripts)

A curated set of Google Ads Scripts for monitoring, bidding, and campaign management.

## Quick Start

1. Open a script and update the `// === CONFIGURATION ===` section.
2. In Google Ads, go to `Tools & Settings` -> `Scripts` and create a new script.
3. Paste the script content, authorize, and run a preview.
4. Schedule the script at the recommended frequency.

## Scripts

**Bidding**
- `scripts/bidding/automated-bidding.gs` — Applies hourly bid modifiers via ad schedules.
- `scripts/bidding/location-based-bidding.gs` — Adjusts location bid modifiers based on CTR.
- `scripts/bidding/weather-based-bidding.gs` — Updates labels and budgets based on current weather.
- `scripts/bidding/distance-based-bidding.gs` — Adds proximity targets with bid modifiers.

**Monitoring**
- `scripts/monitoring/404-checker.gs` — Pauses ads pointing to 404 pages.
- `scripts/monitoring/broken-link-checker.gs` — Logs non-200 URL responses.
- `scripts/monitoring/automated-alerts.gs` — Emails alerts for low conversions.
- `scripts/monitoring/quality-score-monitor.gs` — Tracks quality score distribution and alerts on low scores.
- `scripts/monitoring/account-anomaly-detector.gs` — Compares today vs 7/30-day averages and alerts on deviations.
- `scripts/monitoring/performance-reporting.gs` — Exports campaign performance to Google Sheets.
- `scripts/monitoring/spreadsheet-reporting.gs` — Exports campaign, ad group, and keyword performance to Sheets.

**Keywords**
- `scripts/keywords/keyword-management.gs` — Pauses underperforming keywords by cost per conversion.
- `scripts/keywords/negative-keyword-manager.gs` — Adds negative keywords for costly zero-conversion terms.
- `scripts/keywords/search-term-analyzer.gs` — Suggests keywords and negatives from search terms.

**Campaign Management**
- `scripts/campaign-management/budget-manager.gs` — Pauses campaigns that exceed a monthly spend cap.
- `scripts/campaign-management/ad-scheduling.gs` — Creates ad schedules if missing.
- `scripts/campaign-management/stock-management.gs` — Enables or pauses ad groups by inventory levels.

**Testing**
- `scripts/testing/ab-split-test.gs` — Alternates two ads by day for A/B testing.

## Compatibility

- GAQL is used for reporting in the scripts that query performance data.
- Responsive Search Ads do not expose `getHeadline()`, so scripts log ad IDs and types instead.
- Budget updates require non-shared budgets with edit access.

## Contributing

See `CONTRIBUTING.md` for guidelines.

## License

MIT. See `LICENSE`.

## Contact

Open-source inquiries: open-source@weblifter.com.au
