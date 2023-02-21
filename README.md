# Unidouble

The objective of Unidouble is to be a better version of Ebay.

## Deploy a new version of the program to devnet

First we need to change `localnet` to `devnet` in anchor.toml.

```bash
rm -rf target/deploy/\*
```

```bash
anchor build
```

Change the old `programId` to the new one.

```bash
anchor build
anchor deploy
```

## Deploy a store to devnet

```bash
anchor run devnet
```

1. init store
2. init seller account
3. delete seller account
4. list item
5. update item
6. buy item
7. cancel purchase
8. accept purchase
9. send item
10. review item

at the moment, the seller can accept a purchase and stuck the order there, later I should add a time. For example he has 1 week to ship the order, otherwise the money goes back to the buyer.
