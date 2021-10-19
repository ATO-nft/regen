//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import 'base64-sol/base64.sol';
import "hardhat/console.sol";
import './HexStrings.sol';
import './ToColor.sol';
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

/// @title contract for NFT Generative Art
/// @author Olivier Fernandez / Frédéric Le Coidic

contract Loogies is ERC721Enumerable, Ownable {

  using Strings for uint256;
  using HexStrings for uint160;
  using ToColor for bytes3;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() ERC721("Loogies", "LOOG") {
    // RELEASE THE LOOGIES!
  }

  mapping (uint256 => bytes3) public color;
  mapping (uint256 => uint256) public chubbiness;
  mapping(uint256 => bytes32) public genes;

  uint256 mintDeadline = block.timestamp + 24 hours;

  function mintItem() public returns (uint256) {
      require(block.timestamp < mintDeadline, "DONE MINTING");
      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);

      genes[id] = keccak256(abi.encodePacked( blockhash(block.number-1), msg.sender, address(this) ));
      color[id] = bytes2(genes[id][0]) | ( bytes2(genes[id][1]) >> 8 ) | ( bytes3(genes[id][2]) >> 16 );
      chubbiness[id] = 35+((55*uint256(uint8(genes[id][3])))/255);

      return id;
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");
      string memory name = string(abi.encodePacked('Loogie #',id.toString()));
      string memory description = string(abi.encodePacked('This Loogie is the color #',color[id].toColor(),' with a chubbiness of ',uint2str(chubbiness[id]),'!!!'));
      string memory image = Base64.encode(bytes(generateSVGofTokenById(id)));

      return
          string(
              abi.encodePacked(
                'data:application/json;base64,',
                Base64.encode(
                    bytes(
                          abi.encodePacked(
                              '{"name":"',
                              name,
                              '", "description":"',
                              description,
                              '", "external_url":"https://burnyboys.com/token/',
                              id.toString(),
                              '", "attributes": [{"trait_type": "color", "value": "#',
                              color[id].toColor(),
                              '"},{"trait_type": "chubbiness", "value": ',
                              uint2str(chubbiness[id]),
                              '}], "owner":"',
                              (uint160(ownerOf(id))).toHexString(20),
                              '", "image": "',
                              'data:image/svg+xml;base64,',
                              image,
                              '"}'
                          )
                        )
                    )
              )
          );
  }

  function generateSVGofTokenById(uint256 id) internal view returns (string memory) {

    string memory svg = string(abi.encodePacked(
      '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">',
        renderTokenById(id),
      '</svg>'
    ));

    return svg;
  }

  // Visibility is `public` to enable it being called by other contracts for composition.
  //'.rotate {animation: logoRot 5s linear 1s infinite; transform-origin: 50% 50%;} @keyframes logoRot { 0% {transform: rotateY(0deg);} 50% {transform: rotateY(360deg);} 100% {transform: rotateY(0deg);} }',
  // vers la droite
  //'.rotate {animation: logoRot 4s linear infinite; transform-origin: 50% 50%;} @keyframes logoRot { 0% {transform: translate(0em,0);} 50% {transform: translate(5em,0);} 100% {transform: translate(0em,0);} }',
  //'.rotate {animation: logoRot 4s linear infinite; transform-origin: 50% 50%;} @keyframes logoRot { 0% {transform: translate(0,0);} 50% {transform: translate(100px,0);} 100% {transform: translate(0,0);} }',
  // vers bas
  //'.rotate {animation: logoRot 4s linear infinite; transform-origin: 50% 50%;} @keyframes logoRot { 0% {transform: translate(0,0);} 50% {transform: translate(0,100px);} 100% {transform: translate(0,0);} }',
  function renderTokenById(uint256 id) public view returns (string memory) {
    string memory render = string(abi.encodePacked(
      '<style type="text/css">',
        '.rotate {animation: logoJump 2s infinite; transform-origin: 50% 50%;}',
        ' @keyframes logoJump { 0% {transform: translate(0,0);} 25% {transform: translate(0,100px);} 50% {transform: translate(0,0);}',
        '75% {transform: rotateY(0deg);} 100% {transform: rotateY(360deg);} }',
      '</style>',
      '<g class="rotate">',
      '<g id="eye1">',
          '<ellipse stroke-width="3" ry="29.5" rx="29.5" id="svg_1" cy="154.5" cx="181.5" stroke="#000" fill="#fff"/>',
          '<ellipse ry="3.5" rx="2.5" id="svg_3" cy="154.5" cx="173.5" stroke-width="3" stroke="#000" fill="#000000"/>',
      '</g>',
      '<g id="head">',
          '<ellipse fill="#',
          color[id].toColor(),
          '" stroke-width="3" cx="204.5" cy="211.80065" id="svg_5" rx="',
          chubbiness[id].toString(),
          '" ry="51.80065" stroke="#000"/>',
      '</g>',
      '<g id="eye2">',
          '<ellipse stroke-width="3" ry="29.5" rx="29.5" id="svg_2" cy="168.5" cx="209.5" stroke="#000" fill="#fff"/>',
          '<ellipse ry="3.5" rx="3" id="svg_4" cy="169.5" cx="208" stroke-width="3" fill="#000000" stroke="#000"/>',
      '</g>',
      '</g>'
    ));

    return render;
  }

  function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
      if (_i == 0) {
          return "0";
      }
      uint j = _i;
      uint len;
      while (j != 0) {
          len++;
          j /= 10;
      }
      bytes memory bstr = new bytes(len);
      uint k = len;
      while (_i != 0) {
          k = k-1;
          uint8 temp = (48 + uint8(_i - _i / 10 * 10));
          bytes1 b1 = bytes1(temp);
          bstr[k] = b1;
          _i /= 10;
      }
      return string(bstr);
  }
}
