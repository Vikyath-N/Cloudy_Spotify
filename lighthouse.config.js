module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.85 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
        'categories:pwa': 'off', // PWA not required for this project
        
        // Performance budgets for AI application
        'resource-summary:script:size': ['error', { maxNumericValue: 1000000 }], // 1MB JS budget
        'resource-summary:total:size': ['warn', { maxNumericValue: 3000000 }], // 3MB total budget
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }], // 2s FCP
        'largest-contentful-paint': ['warn', { maxNumericValue: 3000 }], // 3s LCP
        'interactive': ['warn', { maxNumericValue: 4000 }], // 4s TTI
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }], // CLS < 0.1
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
