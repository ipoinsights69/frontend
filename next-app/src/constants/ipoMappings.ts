export const IPO_MAPPINGS = {
  hero: {
    logo: 'logo',
    title: 'ipoName',
    status: 'status',
    industry: 'industry',
    listingAt: 'listingAt',
    listingDate: 'listingDate',
  },
  performance: {
    issuePrice: 'basicDetails.issuePrice',
    faceValue: 'basicDetails.faceValue',
    listingPrice: 'listingPrice',
    listingGain: 'listingGainPercentage',
    subscription: 'subscriptionHistory.overall_subscription.total.subscription_times',
    subscriptionDetails: {
      NII: 'subscriptionHistory.overall_subscription.non_institutional.subscription_times',
      Retail: 'subscriptionHistory.overall_subscription.retail.subscription_times',
      QIB: 'subscriptionHistory.overall_subscription.qib.subscription_times',
    },
    issueSize: 'basicDetails.issueSize',
    lotSize: 'basicDetails.lotSize',
  },
  timeline: {
    openDate: 'openDate',
    closeDate: 'closeDate',
    allotmentDate: 'allotmentDate',
    creditOfShares: 'creditOfShares',
    listingDate: 'listingDate',
  },
  keyMetrics: [
    { label: 'ROE', key: 'financials.ratios.roe' },
    { label: 'ROCE', key: 'financials.ratios.roce' },
    { label: 'P/E Ratio', key: 'financials.eps.pe_post' },
    { label: 'EPS', key: 'financials.eps.post' },
    { label: 'Lot Size', key: 'lotSize' },
  ],
  about: {
    details: 'description',
  },
  objectives: {
    data: 'additionalTables.3.rows',
  },
  promoter: {
    promoters: 'promoters',
    preIssue: 'promoterHolding.holdings.share_holding_pre_issue',
    postIssue: 'promoterHolding.holdings.share_holding_post_issue',
  },
  contact: {
    address: 'contactDetails.full_address',
    phone: 'contactDetails.phone',
    email: 'contactDetails.email',
    website: 'contactDetails.website',
  },
  financials: {
    data: 'financials.data',
  },
  subscription: {
    overall: 'subscription_details.status.overall',
    retail: 'subscription_details.status.retail',
    nii: 'subscription_details.status.nii',
    qib: 'subscription_details.status.qib',
    dayWise: 'subscription_details.day_wise',
  },
  faqs: 'faqs',
  fallback: 'Data will be available soon.',
}; 