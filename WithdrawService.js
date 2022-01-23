
const {  handleWithdrawals, checkWithrawals } = require('./SingleTxPerBlock')
const {  handle } = require('./MultipleTxsPerBlock')
const { WithdrawServiceInterval, BatchSize, massivePerBlock } = require('./utils/constants.json')

function start() {
    console.log("Withdrawal service started!!!")
    handleWithdraws();
}

async function handleWithdraws() {
    let pending = 0;
    while (true) {
        console.log("Checking WITHDRAWALS!!!")
        if (pending == 0)
            pending = await checkWithrawals();
        if(pending > 0){
            console.log(`Found #${pending} pending withdrawals!!!`)
            let txs = pending / BatchSize;
            console.log("Sending #"+txs+" transactions")
            if (massivePerBlock)
                await handle(txs, BatchSize);
            else {
                for(let i = 0; i < txs; i++){
                    await handleWithdrawals(txs, BatchSize);
                     
                }
            }
           
            pending = 0;
            console.log("all withdrawals processed, check again")    
            
            
        }
        await new Promise(resolve => setTimeout(resolve, parseInt(WithdrawServiceInterval) ? WithdrawServiceInterval : 2000)); // sleep for 2 seconds before checking pending withdrawals if WithdrawServiceInterval not defined
    }
}
start();
