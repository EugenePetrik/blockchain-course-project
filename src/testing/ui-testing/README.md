# Blockchain For Test Automation Engineers

***

## Pet Shop test framework with Synpress and Metamask

### Prerequisites

Clone this project into a secondary directory. It's essential to ensure that the Pet Shop project is up and running
before proceeding with any further development and testing activities.

### Setup Guide

1. Install npm packages

```bash
yarn install
```

2. Install playwright browsers

```bash
yarn playwright install
```

3. Utilize Synpress for interaction with Metamask during test creation. The following methods will prove beneficial:

- The custom util method `setupMetamaskWallet` or `initialSetup` method
- The `acceptAccess` method
- The `confirmTransaction`method
- The `rejectTransaction` method
- There are also various other methods available to cater to your specific requirements.
