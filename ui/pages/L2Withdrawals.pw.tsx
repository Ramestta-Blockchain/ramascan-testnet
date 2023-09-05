import { test as base, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import { data as withdrawalsData } from 'mocks/l2withdrawals/withdrawals';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';
import * as configs from 'playwright/utils/configs';

import L2Withdrawals from './L2Withdrawals';

const test = base.extend({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: contextWithEnvs(configs.featureEnvs.rollup) as any,
});

const WITHDRAWALS_API_URL = buildApiUrl('l2_withdrawals');
const WITHDRAWALS_COUNT_API_URL = buildApiUrl('l2_withdrawals_count');

test('base view +@mobile', async({ mount, page }) => {
  await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
    status: 200,
    body: '',
  }));

  await page.route(WITHDRAWALS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(withdrawalsData),
  }));

  await page.route(WITHDRAWALS_COUNT_API_URL, (route) => route.fulfill({
    status: 200,
    body: '397',
  }));

  const component = await mount(
    <TestApp>
      <L2Withdrawals/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
