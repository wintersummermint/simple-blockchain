const { SHA256 } = require("crypto-js");

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();

    }

    calculateHash() {
        return SHA256(this.index, this.timestamp, this.data, this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        // this.difficulty = 2;
    }

    createGenesisBlock() {
        return new Block(0, '04/04/2023', { from : '0xNixon', to: 'origin', amount : 0 }, '0');
    }
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if (currentBlock.hash!== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            };
        
        }
        return true;
    }
}

class Wallet {
    constructor() {
        this.balance = 0;
    }

    getBalance(blockchain, address) {
        blockchain.chain.forEach(block => {
            // [0]"origin"== "0xNixon" false
            // [1]"0xKyle"== "0xNixon" false
             // [2]"0xKyle"== "0xNixon" false
             // [3]"0xNixon"== "0xNixon" true

            if (block.data.to == address) { 
                this.balance += block.data.amount;
            }
            if (block.data.from == address) {
                this.balance -= block.data.amount;
            };
        });
        return this.balance;
    }
}

let ganttSparkChain = new Blockchain();

// mocking the transaction when sending something on the blockchain.

ganttSparkChain.addBlock(new Block(1, '04/05/2023', {type : 'deposit', from : 'binance', to: '0xKyle', amount : 20 }));
ganttSparkChain.addBlock(new Block(2, '04/06/2023', {type : 'send', from : '0xNixon', to: '0xKyle', amount : 10 }));
ganttSparkChain.addBlock(new Block(3, '04/07/2023', {type : 'send', from : '0xKyle', to: '0xNixon', amount : 20}));

console.log(JSON.stringify(ganttSparkChain, null, 4));
console.log(`Is Blockchain valid? ${ganttSparkChain.isChainValid()}`);

let wallet = new Wallet();

console.log(wallet.getBalance(ganttSparkChain, '0xKyle'));