const Web3 = require('web3')
const {rpc_url, tokenAddr, admin} = require('./utils/constants.json')
const {abi} = require("./utils/Token.json")

// config
const web3 = new Web3(rpc_url)

async function handleWithdrawals( txs, batchSize ) {
  try {
    
      web3.eth.accounts.wallet.add(admin.privateKey);
      var contract = new web3.eth.Contract(abi, tokenAddr) 
      
      var newNonce = await web3.eth.getTransactionCount(admin.publicKey)
      console.log("processing nonce# "+newNonce)
      const gas = await contract.methods.handleWithdrawals(batchSize).estimateGas({from: admin.publicKey})
      console.log(">>>>>>>>Gas# "+gas);
      let tx = await contract.methods.handleWithdrawals(batchSize).send({from: admin.publicKey, gas: gas, nonce: newNonce})
      
      console.log('Withdarawals processed, txHash:'+tx.transactionHash);
      await web3.eth.accounts.wallet.remove(admin.publicKey)
      return tx;
      
  } catch (error) {
    console.error(error)
  }
}

async function checkWithrawals() {
      var contract = new web3.eth.Contract(abi, tokenAddr) 
      let pending = await contract.methods.pendingWithdrawals().call();
      console.log("PendingWithdrawals#"+pending.toString())
      return parseInt(pending.toString());
}


  



module.exports = {
    handleWithdrawals,
    checkWithrawals
}
