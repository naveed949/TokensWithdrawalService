# Tokens Withdrawal Service
This is an NodeJS backend service responsible of processing withdraw requests, received through Token smartcontract dealing with `nonce` issue.

# Deployment
To deploy & run withdraw service please following steps mentioned below
## 1. install dependencies
To install dependencies 
```code
npm install
```

## 2. configuration
Before executing the service make sure you've updated `utils/constants.json` 

where:
- **`rpc_url`** - this is the blockchain node URL where **Token** smartcontract is deployed
- **`tokenAddr`** - Token smartcontract address deployed on **rpc_url** blockchain.
- **`admin`** - admin wallet KeyPair, this should be the account from which Token smartcontract was deployed. Withdraw service will be using this account to send user their withdrawn tokens.
- **`BatchSize`** - mention here the number of withdraw entries you want to process of token holders per Transaction over Token smartcontract.
- **`WithdrawServiceInterval`** - it is a time interval (in miliseconds) which it to tell withdraw service the interval after which it should check for any pending withdraws to be processed from Token smartcontract.
- **`massivePerBlock`** - it a flag (true/false) to tell withdraw service which approach to use while processing users pending withdrawals. More information about these approaches is explained in below relevant section.

## 3. Run service
To run service
```code
npm run service
```
# Approaches
Following are the two approaches used to process pending withdraws.
## 1. Signle Transaction per Block
In this technique withdraw service **divide** `total pending Withdrawals` with `BatchSize` to determine total transactions to be fired from admin account.
```code
for example:
    pendingWithdraws = 1000
    BatchSize = 50
    transactions = pendingWithdraws / BatchSize
    i.e:
    transactions = 20

```
So, as per above example `20` transactions will be broadcasted in synchronous way where once one transaction is mined other will be broadcasted to avoid nonce collision.

Implementation of this technique can be found at **`./SingleTxPerBlock.js`** file.

## 2. Multiple Transactions per Block
In this technique as per example (mentioned in 1st technique) `20` transactions will be broadcasted asynchronusly, 

which means 20 transactions will be added at once/simeltaneously into `txPool` from where miner(s) will be including as much as he wants into his block.

This technique is making sure to avoid `nonce` collision and thus if due to any case if EVM throws error on any transaction, this technique broadcast that transaction with new available nonce making sure there's no gap between broadcasted nonces into `txPool` so that no transaction could become stuck into `txPool` forever.

Implementaion of this technique can be found at **`MultipleTxsPerBlock.js`** file.

## Example
Given below is the log of withdraw service using 2nd technique with **`BatchSize: 50`** has processed **1000 transactions.** over Rinkeby Testnet. [smartcontract link](https://rinkeby.etherscan.io/address/0x1d2fa695b58c0778144c99b5c4e8cd029608bcdd)
```code
Withdrawal service started!!!
Checking WITHDRAWALS!!!
PendingWithdrawals#1000
Found #1000 pending withdrawals!!!
Sending #20 transactions
Withdrawal tx of nonce# 506 confirmed!!!
blockNumber:10041409
Withdrawal tx of nonce# 507 confirmed!!!
blockNumber:10041409
Withdrawal tx of nonce# 505 confirmed!!!
blockNumber:10041409
Withdrawal tx of nonce# 504 confirmed!!!
blockNumber:10041409
Withdrawal tx of nonce# 503 confirmed!!!
blockNumber:10041409
Withdrawal tx of nonce# 509 confirmed!!!
blockNumber:10041413
Withdrawal tx of nonce# 508 confirmed!!!
blockNumber:10041413
Withdrawal tx of nonce# 516 confirmed!!!
blockNumber:10041413
Withdrawal tx of nonce# 511 confirmed!!!
blockNumber:10041413
Withdrawal tx of nonce# 515 confirmed!!!
blockNumber:10041413
Withdrawal tx of nonce# 510 confirmed!!!
blockNumber:10041413
Withdrawal tx of nonce# 513 confirmed!!!
blockNumber:10041413
Withdrawal tx of nonce# 512 confirmed!!!
blockNumber:10041413
Withdrawal tx of nonce# 514 confirmed!!!
blockNumber:10041413
Withdrawal tx of nonce# 520 confirmed!!!
blockNumber:10041417
Withdrawal tx of nonce# 518 confirmed!!!
blockNumber:10041417
Withdrawal tx of nonce# 522 confirmed!!!
blockNumber:10041417
Withdrawal tx of nonce# 517 confirmed!!!
blockNumber:10041417
Withdrawal tx of nonce# 521 confirmed!!!
blockNumber:10041417
Withdrawal tx of nonce# 519 confirmed!!!
blockNumber:10041417
all withdrawals processed, check again
Checking WITHDRAWALS!!!
PendingWithdrawals#0
Checking WITHDRAWALS!!!
PendingWithdrawals#0

```
