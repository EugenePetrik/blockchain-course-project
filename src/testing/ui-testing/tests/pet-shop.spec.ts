import {
  acceptAccess,
  confirmTransaction,
  rejectTransaction,
  switchAccount,
} from '@synthetixio/synpress/commands/metamask';
import { test, expect } from '../common/fixtures';
import { importNewAccount, setupMetamaskWallet } from '../common/utils';

test.describe('Pet Shop UI tests', () => {
  test('Should adopt a pet', async ({ context, browser }) => {
    const page = context.pages()[0];
    await setupMetamaskWallet(browser);
    await importNewAccount(String(process.env.ACCOUNT_PRIVATE_KEY));
    await switchAccount(2);
    await page.bringToFront();

    await page.goto('/');
    await acceptAccess();

    await expect(page.locator('div.panel-pet')).not.toHaveCount(0);

    await page.locator('[data-id="0"]').click();

    const transaction = await confirmTransaction();
    expect(transaction).toHaveProperty('recipientPublicAddress');
    expect(transaction).toHaveProperty('networkName');
    expect(transaction).toHaveProperty('customNonce');
    expect(transaction.confirmed).toEqual(true);
    await expect(page.locator('[data-id="0"]')).toHaveText('Success');
  });

  test('Adoption still available after cancel adopt transaction', async ({
    context,
    browser,
  }) => {
    const page = context.pages()[0];
    await setupMetamaskWallet(browser);
    await importNewAccount(String(process.env.ACCOUNT_PRIVATE_KEY));
    await switchAccount(2);
    await page.bringToFront();

    await page.goto('/');
    await acceptAccess();

    await expect(page.locator('div.panel-pet')).not.toHaveCount(0);

    await page.locator('[data-id="1"]').click();

    const transaction = await rejectTransaction();
    expect(transaction).toEqual(true);
    await expect(page.locator('[data-id="1"]')).toHaveText('Adopt');
  });

  test('The Pet Shop app should be downloaded', async ({ context, browser }) => {
    const page = context.pages()[0];

    await page.goto('/');

    await expect(page).toHaveTitle('My Pet Shop');
    await expect(page.locator('h1')).toHaveText('My Pet Shop');

    await expect(page.locator('div.panel-pet')).toHaveCount(17);

    const petsTitle = await page.locator('h3.panel-title').allInnerTexts();
    expect(petsTitle).toEqual([
      'Frieda',
      'Gina',
      'Collins',
      'Melissa',
      'Jeanine',
      'Elvia',
      'Latisha',
      'Coleman',
      'Nichole',
      'Fran',
      'Leonor',
      'Dean',
      'Stevenson',
      'Kristina',
      'Ethel',
      'Terry',
      'Terry',
    ]);

    const petsBreed = await page.locator('span.pet-breed').allInnerTexts();
    expect(petsBreed).toEqual([
      'Scottish Terrier',
      'Scottish Terrier',
      'French Bulldog',
      'Boxer',
      'French Bulldog',
      'French Bulldog',
      'Golden Retriever',
      'Golden Retriever',
      'French Bulldog',
      'Boxer',
      'Boxer',
      'Scottish Terrier',
      'French Bulldog',
      'Golden Retriever',
      'Golden Retriever',
      'Golden Retriever',
      'Golden Retriever',
    ]);
  });
});
