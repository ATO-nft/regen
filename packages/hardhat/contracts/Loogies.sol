//SPDX-License-Identifier:  GPL-3.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import 'base64-sol/base64.sol';
import './HexStrings.sol';
import "hardhat/console.sol";

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract Loogies is ERC721Enumerable, Ownable {

  using Strings for uint256;
  using HexStrings for uint160;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  mapping (bytes32 => bool) public hashSVG;
  mapping (uint256 => bytes) public images;

  constructor() ERC721("Regen", "REGEN") {
  }

  function mintItem(string memory imageData64) external returns (uint256) {

      bytes32 keccakImage = keccak256(abi.encodePacked(imageData64));
      require(!_existImage(keccakImage), "ALREADY MINTED");

      _tokenIds.increment();

      uint id = _tokenIds.current();
      _mint(msg.sender, id);

      hashSVG[keccakImage] = true;
      images[id] = bytes(imageData64);

      return id;
  }

	function alreadyMinted(string memory imageData64) public view returns (bool) {
    bytes32 keccakImage = keccak256(abi.encodePacked(imageData64));
		return _existImage(keccakImage);
	}

	function _existImage(bytes32 keccakImage) internal view returns (bool) {
		return hashSVG[keccakImage];
	}

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");
      string memory name = string(abi.encodePacked('Regen #',id.toString()));
      string memory description = string(abi.encodePacked('Regen Generative Art NFT'));

      return
          string(
              abi.encodePacked(
                'data:application/json;base64,',
                Base64.encode(
                    bytes(
                          abi.encodePacked(
                              '{"name":"', name, '", "description":"', description,
                              '", "owner":"', (uint160(ownerOf(id))).toHexString(20),
                              '", "image": "', 'data:image/svg+xml;base64,', images[id],
                              '"}'
                          )
                        )
                    )
              )
          );
  }
}