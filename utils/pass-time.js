const { network } = require("hardhat")

async function passTime(amount) {
  console.log("----------------");
  console.log("Moving time...");
  await network.provider.send("evm_increaseTime", [amount]);
  console.log(`Moved forward in time ${amount} seconds`);
  console.log("----------------");
}

module.exports = { passTime }