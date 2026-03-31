export const ELECTRONICS_PASSPORT_CONTEXT = {
  '@context': [
    'https://schema.org',
    {
      'lp': 'https://looppass.com/ontology/',
      'electronics': 'lp:electronics',
      'bom': 'lp:billOfMaterials',
      'components': 'lp:components',
      'substanceCompliance': 'lp:substanceCompliance',
      'rohs': 'lp:rohsCompliance',
      'reach': 'lp:reachCompliance',
      'warranty': 'schema:warranty',
      'modelNumber': 'schema:model',
      'firmwareVersion': 'schema:softwareVersion',
      'disassemblyManual': 'lp:disassemblyGuide',
    },
  ],
  '@type': 'lp:ElectronicsPassport',
};
