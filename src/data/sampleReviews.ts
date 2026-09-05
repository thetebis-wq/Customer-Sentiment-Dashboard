export interface SampleDataset {
  id: string;
  name: string;
  category: string;
  description: string;
  rawText: string;
}

export const SAMPLE_DATASETS: SampleDataset[] = [
  {
    id: 'saas-cloud',
    name: 'B2B SaaS Cloud Platform (15 Reviews)',
    category: 'Software & Productivity',
    description: 'Reviews spanning 6 months detailing billing disputes, onboarding praise, and API downtime.',
    rawText: `[2024-01-12] Rating: 5/5 - Outstanding onboarding experience! Sarah from support set up our entire team within two hours. The UI is lightning fast and integrations with Slack are seamless.
[2024-01-20] Rating: 4/5 - Really solid feature set. Our engineering team loves the automated reports. Minor gripe: exporting to CSV occasionally drops non-ASCII characters.
[2024-02-04] Rating: 2/5 - We hit severe API rate limiting during our quarterly launch with zero alert notification. Downtime cost us $15k in lost inbound leads. Support ticket took 48 hours to answer.
[2024-02-18] Rating: 1/5 - Billing nightmare! We were charged for 50 inactive seats despite removing them 2 weeks before billing cycle renewal. Getting a refund took 3 escalated phone calls.
[2024-02-27] Rating: 5/5 - The new dashboard analytics overhaul in v4.2 is brilliant. Visualizing conversion cohorts has never been cleaner.
[2024-03-08] Rating: 3/5 - The tool is generally good, but mobile responsiveness is virtually nonexistent. Impossible to approve workflows while traveling on iPhone.
[2024-03-22] Rating: 2/5 - Frequent intermittent 502 bad gateway errors on Monday mornings. Reliability has degraded significantly over the last two months.
[2024-04-05] Rating: 4/5 - Excellent documentation and SDKs. The Python library saved our data science team 40+ hours of custom scripting.
[2024-04-19] Rating: 1/5 - Account manager was reassigned without notice. Our new rep knows nothing about our enterprise contract and ignored our security audit questionnaires.
[2024-05-02] Rating: 5/5 - Customer support turnaround has dramatically improved since April! Prompt resolution via chat in under 3 minutes.
[2024-05-15] Rating: 4/5 - Pricing is on the steeper side compared to competitors, but the granular RBAC permissions justify the enterprise tier for compliance teams.
[2024-05-28] Rating: 2/5 - Search function inside the document repository is painfully slow and frequently returns irrelevant results or times out completely.
[2024-06-10] Rating: 5/5 - Love the AI summary generator and automated weekly digests. Kept our C-suite aligned with zero friction.
[2024-06-21] Rating: 3/5 - Good core tool, but the notification settings are all-or-nothing. Spamming my inbox with 40 emails a day or missing urgent alerts.
[2024-07-01] Rating: 4/5 - Very stable release this month. Appreciate the transparent status page updates during scheduled maintenance windows.`
  },
  {
    id: 'ecommerce-retail',
    name: 'E-Commerce Marketplace & Delivery (12 Reviews)',
    category: 'Retail & Fulfillment',
    description: 'Customer feedback highlighting shipping speed, return difficulties, and product quality.',
    rawText: `Jan 5, 2024 - "Package arrived within 24 hours in pristine condition! Eco-friendly packaging was a pleasant surprise. 5 stars."
Jan 18, 2024 - "Great product variety and honest customer reviews. Checkout was one-click simple with Apple Pay."
Feb 2, 2024 - "Delivery driver left package in pouring rain beside driveway instead of covered porch. Box was soaked through, damaging goods inside."
Feb 22, 2024 - "Returning items is a bureaucratic disaster. Forced to print labels at home, then charged an undisclosed $8 restock fee."
Mar 10, 2024 - "Customer service bot kept running in endless loops and refused to connect me to a human agent. Extremely frustrating."
Mar 28, 2024 - "Product quality is exceptional! Exactly as described in photos and true to sizing measurements."
Apr 14, 2024 - "Order was delayed by 9 days with no tracking status update. Arrived well after my anniversary date."
Apr 30, 2024 - "Loyalty reward points program is fantastic. Redeemed 20% off coupon seamlessly on my second order."
May 12, 2024 - "App crashes constantly during flash sales. Cart emptied itself three times while trying to process payment."
May 29, 2024 - "Received wrong color variant (ordered navy, received neon green). The exchange process took nearly 3 weeks."
Jun 14, 2024 - "High quality fabric and stitching. Customer support agent Marcus refunded my shipping fee right away due to carrier delay."
Jul 3, 2024 - "Search filters need work. Selecting 'In Stock' still displays backordered items."`
  },
  {
    id: 'smart-hardware',
    name: 'Smart Home IoT & Mobile App (10 Reviews)',
    category: 'Hardware & IoT',
    description: 'Feedback on device setup, Wi-Fi pairing drops, battery life, and firmware upgrades.',
    rawText: `2024-02-01: Setup took 5 minutes out of the box. The LED status ring is intuitive and sync with Google Assistant worked immediately.
2024-02-15: Firmware 1.4 update broke 5GHz Wi-Fi band connectivity. Had to split my router SSID to get it working again.
2024-03-01: Battery life is half of what is advertised. Drains from 100% to 15% in just 4 days with moderate usage.
2024-03-20: Premium build quality, sleek brushed aluminum chassis looks gorgeous on the wall.
2024-04-10: Motion detection false alarms are unbearable. Tree branches swaying triggered 35 push notifications in one afternoon.
2024-04-25: Geofencing auto-arm feature is flawless. Never have to worry about manually setting security when leaving home.
2024-05-12: The mandatory cloud subscription to view clips older than 24 hours is greedy for a $250 hardware device.
2024-05-30: Latest app update introduced a dark mode and reduced live-view latency down to under 1 second. Great progress.
2024-06-15: Two-way audio speaker produces loud static buzz and is unintelligible to visitors standing at door.
2024-07-02: Fantastic night vision camera resolution. Clear details even in pitch black conditions.`
  }
];
