export const FASHION_PASSPORT_CONTEXT = {
  '@context': [
    'https://schema.org',
    {
      'lp': 'https://looppass.com/ontology/',
      'fashion': 'lp:fashion',
      'materialOrigin': 'lp:materialOrigin',
      'weavingOrigin': 'lp:weavingOrigin',
      'dyeingOrigin': 'lp:dyeingOrigin',
      'assemblyOrigin': 'lp:assemblyOrigin',
      'tier1Supplier': 'lp:tier1Supplier',
      'tier2Supplier': 'lp:tier2Supplier',
      'tier3Supplier': 'lp:tier3Supplier',
      'tier4Supplier': 'lp:tier4Supplier',
      'recycledContent': 'lp:recycledContent',
      'careInstructions': 'schema:howToUse',
      'composition': 'lp:composition',
    },
  ],
  '@type': 'lp:FashionPassport',
};
