//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Bears is ERC721, Ownable {
    uint256 public tokenId;
    string baseTokenUri;
    bool paused = false;
    mapping (uint256 => string) private inputStrings;

    // TODO set mint price when live
    uint256 price = 5 * 10**15; // Each mint will cost 0.05 MATIC

    modifier onlyWhenNotPaused {
        require(!paused, "Contract is currently paused");
        _;
    }

    constructor(string memory _base) ERC721("World Congress Bears", "WCB") {
        tokenId = 0;
        baseTokenUri = _base;
        console.log("World Congress Bears contract has been deployed!");
    }

    function _baseURI() internal view override returns(string memory) {
        return baseTokenUri;
    }

    function mint(string calldata _inputString) public payable onlyWhenNotPaused {
        require(msg.value >= price, "Not enough MATIC sent to mint");
        tokenId += 1;
        inputStrings[tokenId] = _inputString;
        _safeMint(msg.sender, tokenId);
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory baseURI = _baseURI();
        string storage inputString = inputStrings[_tokenId];
        return bytes(baseURI).length > 0
            ? string(abi.encodePacked(baseURI, Strings.toString(_tokenId), "?iStr=", inputString))
            : "";
    }

    function pause(bool _state) public onlyOwner {
        paused = _state;
    }

    function withdraw() public onlyOwner {
        address owner = owner();
        uint256 amount = address(this).balance;
        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "Withdrawal was unsuccessful");
    }

    // Set up default functions for the contract
    receive() external payable {}
    fallback() external payable {}
}