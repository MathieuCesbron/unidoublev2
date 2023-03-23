# Unidouble

[![Netlify Status](https://api.netlify.com/api/v1/badges/8fa93e48-7508-4bd8-8d93-a33db97c9aee/deploy-status)](https://app.netlify.com/sites/gregarious-sprinkles-e80835/deploys)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

The objective of Unidouble is to be a better version of Ebay.

## Run locally

```bash
cd app
npm start
```

## Environment

The default solana environment for Unidouble is `devnet`. The environment variable `REACT_APP_NETWORK` can be changed to choose the solana network.

```bash
export REACT_APP_NETWORK="mainnet-beta"
```

## Deploy a new version of the program to devnet

1. Change `localnet` to `devnet` in anchor.toml.

2. ```bash
   rm -rf target/deploy/\*
   ```

3. ```bash
   anchor build
   ```

4. Change the old `programId` to the new one.

5. ```bash
   anchor build
   anchor deploy
   ```

## Deploy a new store

```bash
anchor run deploy
```
