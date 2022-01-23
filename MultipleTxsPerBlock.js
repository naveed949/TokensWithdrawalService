const Web3 = require('web3')
const {rpc_url, tokenAddr, admin} = require('./utils/constants.json')
const {abi} = require("./utils/Token.json")

const web3 = new Web3(rpc_url)

async function handle(txs, batchSize) {

    web3.eth.accounts.wallet.add(admin.privateKey);
    var contract = new web3.eth.Contract(abi, tokenAddr) 
    var nonce = await web3.eth.getTransactionCount(admin.publicKey)
    // var startBlock = await web3.eth.getBlock("latest");
    if (txs > parseInt(txs)){
        txs = parseInt(txs) +1;
    } else {
        txs = parseInt(txs)
    }
    let promises = [];
    let promise;
    for (let i = 0; i < txs; i++) {
        
    promise = new Promise( (resolve, reject) => {
    
         task(nonce+i, 0);
        async function task (newNonce, cap){
        
        let gass = await contract.methods.handleWithdrawals(batchSize).estimateGas({from: admin.publicKey});
        gass = parseInt(gass + ((gass/100) * cap)) // adding cap% more into original estimated gas price;
        
        console.log("cap# "+cap+" of nonce#"+newNonce+" with total fee#"+gass);
        
        contract.methods.handleWithdrawals(batchSize).send({
            from: admin.publicKey, gas: gass, nonce: newNonce} 
            ).then(function(receipt){
                console.log("Withdrawal tx of nonce# "+newNonce+" confirmed!!!")
                console.log("blockNumber:"+receipt.blockNumber)
                resolve(receipt)
            })
            .catch(async function(error, receipt) { 
                let n = await web3.eth.getTransactionCount(admin.publicKey,"pending");
                
                    i = null;
                    console.log("Transaction error of nonce# "+newNonce)
                    console.log("Broadcasting again with 10% more in gas fee & new nonce# "+n)
                    cap += 10;
                    task(n, cap); // broadcasting same nonce with 10% increased gas
                
                
            })
        } // task func
    });
    promises.push(promise)
    }

    let results = await Promise.all(promises)
    await web3.eth.accounts.wallet.remove(admin.publicKey)
    console.log(results.length)

}

module.exports = {
    handle
}

