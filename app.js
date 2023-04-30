let logEl;

const log = (s) => {
  const curr = logEl.innerText;
  logEl.innerText = curr + "\n" + s;
};

const clearLog = (s) => {
  logEl.innerText = "";
};

window.addEventListener("load", async () => {
  logEl = document.getElementById("log");
  const btnConnect = document.getElementById("btnConnect");
  btnConnect.addEventListener("click", async (e) => {
    e.preventDefault();

    const btnApprove = document.getElementById("btnApprove");

    btnApprove.style = "display: block;";
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    log("connected");

    btnApprove.addEventListener("click", async (e) => {
      clearLog();
      e.preventDefault();
      const daiAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
      const roundVotingStrategyAddress =
        "0x10Cb6dEf9B7Eb5cEFA5E14caBAb1109fFf16B7B9";
      const abi = ["function approve(address,uint256)"];
      log(`waiting for tx signature...`);
      const contract = new ethers.Contract(daiAddress, abi).connect(signer);
      const oneDai = ethers.parseUnits("1", "ether");
      const tx = await contract.approve(roundVotingStrategyAddress, oneDai);
      log(`tx sent ${tx.hash}`);
      log(`waiting...`);
      const rec = await tx.wait();
      log(`gasUsed: ${rec.gasUsed}`);
      log(`status: ${rec.status === 1 ? "successful" : "reverted"}`);
    });
  });
});
