let logEl;

const log = (s) => {
  const curr = logEl.innerText;
  logEl.innerHTML = curr + "\n" + s;
};

const clearLog = () => {
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

    const daiAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
    const abi = ["function approve(address,uint256)", "function allowance(address,address) view returns(uint256)"];
    const contract = new ethers.Contract(daiAddress, abi).connect(signer);
    const roundVotingStrategyAddress =
      "0x10Cb6dEf9B7Eb5cEFA5E14caBAb1109fFf16B7B9";

    const currentAllowance = await contract.allowance(signer.address, roundVotingStrategyAddress);
    console.log(currentAllowance);
    log(`currentAllowance: ${ethers.formatUnits(currentAllowance.toString())}<b>ok</b>`);

    btnApprove.addEventListener("click", async (e) => {
      clearLog();
      e.preventDefault();
      log(`waiting for tx signature...`);
      const oneDai = ethers.parseUnits("1", "ether");
      const tx = await contract.approve(roundVotingStrategyAddress, oneDai);
      log(`tx sent <a href="https://etherscan.io/tx/${tx.hash}" target="_blank">${tx.hash}</a>`);
      log(`waiting...`);
      const rec = await tx.wait();
      log(`gasUsed: ${rec.gasUsed}`);
      log(`status: ${rec.status === 1 ? "successful" : "reverted"}`);
    });
  });
});
