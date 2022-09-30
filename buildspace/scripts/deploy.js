const main = async () => {
    const nftContractFactory = await hre.ethers.getContractFactory('PokeNFT');
    const nftContract = await nftContractFactory.deploy();
    await nftContract.deployed();
    console.log("Contract deployed to:", nftContract.address);

    // Call the function.
    // let txn = await nftContract.makePokeNFT()
    // // Wait for it to be mined.
    // await txn.wait()
    // console.log("Minted NFT #1")

    // txn = await nftContract.makePokeNFT()
    // // Wait for it to be mined.
    // await txn.wait()
    // console.log("Minted NFT #2")
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain()