import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

// https://stenciljs.com/docs/config

export const config: Config = {
  namespace: 'cookie-opt-in',
  globalStyle: 'src/global/app.scss',
  globalScript: 'src/global/app.ts',
  outputTargets: [
    {
      type: 'www',
      // uncomment the following line to disable service workers in production
      serviceWorker: null
    },
    {
      type: 'dist'
    }
  ],
  plugins: [
    sass({
      injectGlobalPaths: [
        'src/global/app.scss',
      ]
    })
  ]
};
