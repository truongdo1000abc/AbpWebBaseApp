import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

const oAuthConfig = {
  issuer: 'https://localhost:44352/',
  redirectUri: baseUrl,
  clientId: 'WebAppSample_App',
  responseType: 'code',
  scope: 'offline_access WebAppSample',
  requireHttps: true,
};

export const environment = {
  production: false,
  application: {
    baseUrl,
    name: '::AppNameText',
  },
  oAuthConfig,
  apis: {
    default: {
      url: 'https://localhost:44352',
      rootNamespace: 'WebAppSample',
    },
    AbpAccountPublic: {
      url: oAuthConfig.issuer,
      rootNamespace: 'AbpAccountPublic',
    },
  },
} as Environment;
