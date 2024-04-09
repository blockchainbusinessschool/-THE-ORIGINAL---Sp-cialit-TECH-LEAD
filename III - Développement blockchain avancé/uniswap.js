require('dotenv').config()
const { parse } = require('dotenv')
const { ethers } = require('ethers')
const { writeFile, readFile } = require('fs')

const honeypotCheck = require('./honeypotCheck')

const INFURA_MAINNET_URL = process.env.INFURA_MAINNET_URL
const INFURA_MAINNET_KEY = process.env.INFURA_MAINNET_KEY
const PRIV_KEY = process.env.PRIV_KEY
const PUB_KEY = process.env.PUB_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const WETHAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'

//const provider = new ethers.providers.JsonRpcProvider(INFURA_MAINNET_URL)
const provider = new ethers.providers.WebSocketProvider(`wss://mainnet.infura.io/ws/v3/${INFURA_MAINNET_KEY}`)
const wallet = new ethers.Wallet(PRIV_KEY)
const connectedWallet = wallet.connect(provider)
const factoryInstance = new ethers.Contract('0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
  ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
  connectedWallet
)

// lockers contract instance
const teamFinanceLock = new ethers.Contract('0xE2fE530C047f2d85298b07D9333C05737f1435fB',
  [
    'event Deposit(uint256 id, address indexed tokenAddress, address indexed withdrawalAddress, uint256 amount, uint256 unlockTime)',
    'event LockDurationExtended(uint256 id, uint256 unlockTime)'
  ],
  connectedWallet
)
const unicryptLiquidityLockers = new ethers.Contract('0x663A5C229c09b049E36dCc11a9B0d4a8Eb9db214',
  ['event onDeposit(address lpToken, address user, uint256 amount, uint256 lockDate, uint256 unlockDate)'],
  connectedWallet
)
const pinkLock2 = new ethers.Contract('0x71B5759d73262FBb223956913ecF4ecC51057641',
  ['event LockedAdded(uint256 indexed id, address token, address owner, uint256 amount, uint256 unlockDate)'],
  connectedWallet
)

const callHoneypotCheck = async (contractAddress, pairAddress) => {
  console.log(`
  =================
  honeypot check:`)
  var result = await honeypotCheck.honeypotCheck(contractAddress)

  if (!result.isHoneypot) {
      if (result.problem && result.liquidity) {
          console.log(`Token ${contractAddress} liquidity is low - check again in 1 min`)
          var count = 0
          var IntervalId = setInterval(async function() {
              var result = await honeypotCheck.honeypotCheck(contractAddress)
              count++
              if (result.problem && result.liquidity && count < 30) {
                  console.log(`check #${count}`) 
                  console.log(`Token ${contractAddress} liquidity is still low - check again in 1 min`)
              } else if (!result.problem && !result.liquidity) {
                  console.log("========================================")
                  console.log("ADD TOKEN", result.tokenSymbol, "TO WAIT TO BUY QUEUE")
                  readFile('./waitToBuy.json', (error, data) => {
                      if (error) {
                          console.log(error)
                          return
                      }
                      const parsedData = JSON.parse(data);
                      parsedData[pairAddress.toString()] = contractAddress
                      writeFile('./waitToBuy.json', JSON.stringify(parsedData, null, 2), (err) => {
                      if (err) {
                          console.log('Failed to write updated data to file')
                          return;
                      }
                      console.log('Updated wait to buy file successfully')
                      })
                  })
                  clearInterval(IntervalId)
              } else if (
                  ( result.priceImpact && parseInt(result.priceImpact) > 2 ) || 
                  ( result.buyFee && parseInt(result.buyFee) >= 10 ) || ( result.sellFee && parseInt(result.sellFee) >= 10 ) ||
                  count >= 30
                  ) {
                  clearInterval(IntervalId)
              } 
          }, 60000);
      } else {
          if (!result.problem) { 
              console.log("================================================")
              console.log("ADD TOKEN", result.tokenSymbol, "TO WAIT TO BUY QUEUE DIRECTLY")
              readFile('./waitToBuy.json', (error, data) => {
                  if (error) {
                      console.log(error)
                      return
                  }
                  const parsedData = JSON.parse(data);
                  parsedData[pairAddress.toString()] = contractAddress
                  writeFile('./waitToBuy.json', JSON.stringify(parsedData, null, 2), (err) => {
                  if (err) {
                      console.log('Failed to write updated data to file')
                      return;
                  }
                  console.log('Updated wait to buy file successfully')
                  })
              })
          }
      }
  }
}


const getTotalSupply = async (contractAddress) => {
  const res = await fetch(`https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=${contractAddress}&apikey=${ETHERSCAN_API_KEY}`)
  if(res.ok) {
    const data = await res.json()
    console.log('total supply', data.result)
  }
}
const getContractABI = async (contractAddress) => {
  const res = await fetch(`https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${ETHERSCAN_API_KEY}`)
  if(res.ok) {
    const data = await res.json()
    console.log('is contract verified:', data.status)
  }
}
const getTotalLPToken = async (pairAddress) => {
  const res = await fetch(`https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=${pairAddress}&apikey=${ETHERSCAN_API_KEY}`)
  if(res.ok) {
    const data = await res.json()
    console.log('total amount LP token is:', parseInt(data.result))
    return parseInt(data.result)
  }
}
const getWETHinPairAddress = async (pairAddress) => {
  const res = await fetch(`https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${WETHAddress}&address=${pairAddress}&tag=latest&apikey=${ETHERSCAN_API_KEY}`)
  if(res.ok) {
    const data = await res.json()
    console.log('total amount of WETH in pair Address', data.result)
    return parseInt(data.result)
  }
}
const getWETHLocked = async (pairAddress, lpTokenAmount) => {
  const amount = lpTokenAmount * await getWETHinPairAddress(pairAddress) / await getTotalLPToken(pairAddress)
  console.log('amount locked', amount)
  return parseInt(amount)
}


// created pair event listner
factoryInstance.on('PairCreated', async (token0, token1, pairAddress) => {
  console.log(`
  New Pair detected
  =================
  token0: ${token0}
  token1: ${token1}
  pairAddress: ${pairAddress}
  `)
  if(token0 != WETHAddress) {
    await getTotalSupply(token0)
    await getContractABI(token0)
    // 
    await callHoneypotCheck(token0.toLowerCase(), pairAddress.toLowerCase())
  } else if (token1 != WETHAddress) {
    await getTotalSupply(token1)
    await getContractABI(token1)
    //
    await callHoneypotCheck(token1.toLowerCase(), pairAddress.toLowerCase())
  } else console.log('no WETH detected in the pair')
})


// listen on liquidity locked on Team Finance Lock
teamFinanceLock.on('Deposit', async (id, tokenAddress, withdrawalAddress, amount, unlockTime) => {
  console.log(`
    New Deposit detected on Team Finance
    ====================================
    id: ${id}
    token pair: ${tokenAddress}
    amount: ${amount}
    unlock time: ${unlockTime}
  `)
  readFile('./waitToBuy.json', (error, data) => {
      if (error) {
          console.log(error)
          return
      }
      const parsedData = JSON.parse(data)
      if( 
          parsedData[tokenAddress.toLowerCase()] &&
          ( unlockTime - (Date.now() / 1000) >= 1123200 ) &&
          ( getWETHLocked(tokenAddress, amount) >= 2000000000000000000n )
          ) { 
          console.log(`==================== BUY ${parsedData[tokenAddress.toLowerCase()]} ====================`)
          //buy(parsedData[tokenAddress.toLowerCase()])
          delete parsedData[tokenAddress.toLowerCase()]
          writeFile('./waitToBuy.json', JSON.stringify(parsedData, null, 2), (err) => {
              if (err) {
                  console.log('Failed to write updated data to file')
                  return;
              }
              console.log('Updated wait to buy file successfully')
          })
      }
  })
})
// listen on liquidity locked on Unicrypt
unicryptLiquidityLockers.on('onDeposit', async (lpToken, user, withdrawalAddress, amount, unlockDate) => {
  console.log(`
    New Deposit detected on Unicrypt
    ================================
    token pair: ${lpToken}
    amount: ${amount}
    unlock time: ${unlockDate}
  `)
  readFile('./waitToBuy.json', (error, data) => {
      if (error) {
          console.log(error)
          return
      }
      const parsedData = JSON.parse(data)
      if( 
          parsedData[lpToken.toLowerCase()] &&
          ( unlockDate - (Date.now() / 1000) >= 1123200 ) &&
          ( getWETHLocked(lpToken, amount) >= 2000000000000000000n )
          ) { 
          console.log(`==================== BUY ${parsedData[lpToken.toLowerCase()]} ====================`)
          //buy(parsedData[lpToken.toLowerCase()])
          delete parsedData[lpToken.toLowerCase()]
          writeFile('./waitToBuy.json', JSON.stringify(parsedData, null, 2), (err) => {
              if (err) {
                  console.log('Failed to write updated data to file')
                  return;
              }
              console.log('Updated wait to buy file successfully')
          })
      }
  })
})
// listen on liquidity locked on PinkSale
pinkLock2.on('LockAdded', async (id, token, owner, amount, unlockDate) => {
  console.log(`
    New Deposit detected on PinkSale
    ================================
    id: ${id}
    token pair: ${token}
    amount: ${amount}
    unlock time: ${unlockDate}
  `)
  readFile('./waitToBuy.json', (error, data) => {
      if (error) {
          console.log(error)
          return
      }
      const parsedData = JSON.parse(data)
      if( 
          parsedData[token.toLowerCase()] &&
          ( unlockDate - (Date.now() / 1000) >= 1123200 ) &&
          ( getWETHLocked(token, amount) >= 2000000000000000000n )
          ) { 
          console.log(`==================== BUY ${parsedData[token.toLowerCase()]} ====================`)
          //buy(parsedData[token.toLowerCase()])
          delete parsedData[token.toLowerCase()]
          writeFile('./waitToBuy.json', JSON.stringify(parsedData, null, 2), (err) => {
              if (err) {
                  console.log('Failed to write updated data to file')
                  return;
              }
              console.log('Updated wait to buy file successfully')
          })
      }
  })
})


// event listner
// pair created
// LP token locked on team finance
// -> get WETH locked

// intro ethereum dev tool + hardhat
// create a multicall contract to check if the contract is a honey pot
// deploy the contract with hardhat
// interact with the contract 

// etherscan API:
// -> get contract total supply
// -> get contract ABI
// -> get total LP token
// -> get WETH in pair address

// create a swap / buy function 