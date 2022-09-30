// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
contract PokeNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint public MAX_SUPPLY = 50;
    uint public MINT_PRICE = 0.0001 ether;
    event NewEpicNFTMinted(address sender, uint256 tokenId);



    // We need to pass the name of our NFTs token and its symbol.
    constructor() ERC721 ("PokeNFT", "PKNFT") {
        console.log("This is my NFT contract. Woah!");
    }

      // A function our user will hit to get their NFT.
    function makePokeNFT() public payable {
        require(_tokenIds.current() < MAX_SUPPLY, "Max supply has been reached");
        require(msg.value >= MINT_PRICE, "Not enough ETH to mint");
        // Get the current tokenId, this starts at 0.
        uint256 newItemId = _tokenIds.current();

        // Actually mint the NFT to the sender using msg.sender.
        _safeMint(msg.sender, newItemId);

        // Set the NFTs data.
        string memory concatItemId = string.concat("https://gateway.pinata.cloud/ipfs/QmT98DkjBkctn18CwuDXXe3xyHgodzxeyKqkHnPJzRgmFc/", Strings.toString(newItemId));
        string memory uri = string.concat(concatItemId, ".json");
        _setTokenURI(newItemId, uri);
        console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);

        // Increment the counter for when the next NFT is minted.
        _tokenIds.increment();
        emit NewEpicNFTMinted(msg.sender, newItemId);


    }
}