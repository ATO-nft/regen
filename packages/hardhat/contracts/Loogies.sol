//SPDX-License-Identifier:  GPL-3.0
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
//import "@openzeppelin/contracts/utils/Counters.sol";
//import "@openzeppelin/contracts/utils/Strings.sol";
import 'base64-sol/base64.sol';
//import "hardhat/console.sol";

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

/// @title contract for NFT Generative Art
/// @author Olivier Fernandez / Frédéric Le Coidic

contract Loogies is ERC721Enumerable, Ownable {

	uint private _tokenIds;
	mapping(uint => string[]) colorsSVG;
	mapping(uint => string[]) speedsSVG;
	mapping(bytes32 => bool) hashSVG;

	constructor() ERC721("Regen", "REGEN") {
	}

	// color = #nnnnnn
	// order color : background, face bottom, face top, disk bottom, disk top
	// speed = Xs
	// order speed : background, face bottom, face top, disk bottom, disk top

	function mintItem(string[] memory colors, string[] memory speeds) public returns (uint256) {
			require(colors.length == 10 && speeds.length == 5, "Invalid colors or speeds size");
			//keccak256(abi.encodePacked( blockhash(block.number-1), msg.sender, address(this) ));

			require(alreadyMinted(colors, speeds), "SVG Regen already exist");
			hashSVG[_calcHash(colors, speeds)] = true;

			//_tokenIds.increment();
			_tokenIds++;
			uint256 id = _tokenIds; //.current();
			_mint(msg.sender, id);

			colorsSVG[id] = colors;
			speedsSVG[id] = speeds;
			return id;
	}

	function tokenURI(uint256 id) public view override returns (string memory) {
			require(_exists(id), "not exist");
			string memory name = string(abi.encodePacked('Regen #', bytes32(id))); //Strings.toString(id)));
			string memory description = string(abi.encodePacked('SVG Regen #',  bytes32(id))); //Strings.toString(id)));
			string memory image = Base64.encode(bytes(generateSVGofTokenById(id)));

			return
					string(
							abi.encodePacked(
								'data:application/json;base64,',
								Base64.encode(
										bytes(
													abi.encodePacked(
															'{"name":"', name, '"',
															'"description:"','"', description, '"',
															'"owner:"', owner(), '"',
															'"image": "', 'data:image/svg+xml;base64,', image,
															'"}'
													)
												)
										)
							)
					);
	}

	function alreadyMinted(string[] memory colors, string[] memory speeds) public view returns (bool) {
		return hashSVG[_calcHash(colors, speeds)];
	}

	function _calcHash(string[] memory colors, string[] memory speeds) private pure returns (bytes32) {
		return keccak256(abi.encodePacked(
			abi.encodePacked(colors[0], colors[1], colors[2], colors[3], colors[4], colors[5], colors[6], colors[7], colors[8], colors[9]),
			abi.encodePacked(speeds[0], speeds[1], speeds[2], speeds[3], speeds[4])
		));
	}

	function generateSVGofTokenById(uint256 id) internal pure returns (string memory) {
		return string(abi.encodePacked(
			_renderHeader(),
			_renderStyle(id),
			_renderBody()
		));
	}

	function _renderHeader() internal pure returns (string memory) {
		return string(abi.encodePacked(
		'<?xml version="1.0" encoding="UTF-8" standalone="no"?>',
		'<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" ',
		'viewBox="0 0 160 210" version="1.1" inkscape:version="0.92.2 5c3e80d, 2017-08-06" inkscape:export-filename="Regen.png">',
		'<defs id="defs10249">',
		'<inkscape:path-effect effect="skeletal" is_visible="true" ',
		'pattern="M 0,5 C 0,2.24 2.24,0 5,0 7.76,0 10,2.24 10,5 10,7.76 7.76,10 5,10 2.24,10 0,7.76 0,5 Z" copytype="single_stretched" prop_scale="0.26458334" ',
		'scale_y_rel="false" spacing="0" normal_offset="0" tang_offset="0" prop_units="false" vertical_pattern="false" fuse_tolerance="0" />',
		'</defs>'
		));
	}

	function _renderBody() internal pure returns (string memory) {
		return string(abi.encodePacked(
		'<g><rect class="backColor" width="100%" height="100%"/></g>',
		'<g inkscape:label="Calque 1" inkscape:groupmode="layer" transform="translate(0,-87)">',

/*
		'<path class="allforms FaceBottom" ',
		'style="stroke:#070000;stroke-width:4" ',
		'd="M 286.60547 33.183594 C 239.91625 33.073129 201.39062 34.314453 201.39062 34.314453 C 194.61625 34.070749 188.12905 34.009766 181.87109 34.009766 C 55.733524 34.192657 41.78172 29.846957 41.669922 75.419922 C 41.325229 215.82703 43.963277 377.08512 44.939453 557.69922 C 73.70351 525.90183 114.40993 507.75023 157.06836 507.68945 C 241.12188 507.68945 309.27148 576.46189 309.27148 661.25586 C 309.27148 697.68344 296.4102 732.95317 273.04297 760.66992 C 385.34415 765.96946 497.5293 753.78711 497.5293 753.78711 C 497.5293 753.78711 457.799 615.38697 445.16797 563.73047 C 441.09152 578.22828 442.52744 709.80694 434.83398 690.98438 C 427.7149 634.02833 428.40491 626.29078 418.93164 565.31445 C 412.50111 555.81128 391.60135 567.69042 386.83594 557.21289 C 368.29169 504.03346 389.47852 484.41797 389.47852 484.41797 C 352.3315 501.77885 299.68322 485.51491 284.18164 477.53516 C 278.15333 474.42838 376.84651 478.51054 368.23438 476.80469 C 328.7337 468.94656 283.54883 460.72266 283.54883 460.72266 C 285.61532 448.84424 368.23467 476.80494 389.70703 459.62695 C 389.70703 459.62695 343.20172 429.47228 347.50781 430.26367 C 373.86061 434.95471 390.74063 444.21513 393.49609 443.11914 C 401.764 439.82952 389.76514 442.6914 402.10938 428.13281 C 407.16154 422.16294 408.48057 412.90384 414.56641 411.625 C 418.29808 410.83266 422.49023 411.86914 422.49023 411.86914 C 422.49023 411.86914 470.71799 424.17404 481.51172 415.1582 C 504.93644 395.54325 487.76886 392.07015 503.90234 383.72461 C 516.53292 377.20708 527.5578 382.81212 528.36133 370.32422 C 528.99277 360.27332 506.65869 365.45161 506.31445 353.81641 C 504.93651 308.06897 539.72921 305.99736 542.71484 299.29688 C 545.70048 292.53515 530.08389 282.84852 532.83984 279.49805 C 535.65287 276.14761 554.59961 260.43164 554.59961 260.43164 C 554.59961 260.43164 558.6181 253.00087 549.71875 242.88867 C 524.91605 214.80705 523.42383 158.52148 523.42383 158.52148 L 533.98828 158.09375 C 533.98828 158.09375 541.22182 152.49072 534.61914 148.53125 C 528.01691 144.511 521.87415 145.0593 521.93164 137.20117 C 521.98909 129.28223 513.83497 71.045168 442.64258 45.826172 C 420.15783 35.700959 346.63447 33.32562 286.60547 33.183594 z M 98.964844 174.91992 L 161.08594 175.3457 C 161.48774 175.3457 161.89117 175.4079 162.29297 175.46875 L 289.52148 176.38281 C 302.26711 176.44313 312.48561 189.47923 312.37109 205.5 L 312.37109 207.93555 C 312.31353 223.95632 301.92141 236.81085 289.17578 236.75 L 160.74219 236.32227 L 98.621094 235.89648 C 93.109635 235.83571 88.745286 230.29155 88.802734 223.4082 C 88.802734 216.58566 93.281941 211.04267 98.736328 211.10352 L 246.28906 212.99219 C 251.91561 213.053 256.45036 213.96663 256.50781 206.90039 L 256.50781 205.80469 C 256.50781 198.73894 251.97221 199.65069 246.3457 199.58984 L 98.849609 199.83398 C 93.338151 199.77268 88.975754 194.22905 89.033203 187.3457 C 89.090267 180.58477 93.395489 175.10384 98.734375 174.98047 C 98.84801 174.98047 98.907804 174.98034 98.964844 174.91992 z M 97.765625 263.1582 C 97.81594 263.17342 97.874381 263.20395 97.931641 263.23438 L 160.05273 263.66016 C 160.45454 263.66016 160.85601 263.72197 161.25781 263.7832 L 288.42969 264.57422 C 301.17573 264.63503 311.39577 277.67063 311.28125 293.69141 L 311.28125 296.12891 C 311.22376 312.14968 300.83202 325.00226 288.08594 324.94141 L 159.65039 324.51562 L 97.529297 324.08789 C 92.017385 324.02708 87.653867 318.48491 87.710938 311.60156 C 87.710938 304.77902 92.190106 299.23602 97.644531 299.29688 L 245.19727 301.18555 C 250.82377 301.24681 255.35857 302.15999 255.41602 295.09375 L 255.41602 293.99609 C 255.41602 286.9303 250.88045 287.84405 245.25391 287.7832 L 97.759766 288.02734 C 92.247854 287.96657 87.883957 282.42241 87.941406 275.53906 C 87.998893 268.7773 92.305193 263.29591 97.644531 263.17383 C 97.673256 263.1434 97.71531 263.14299 97.765625 263.1582 z " ',
		' transform="matrix(0.26458333,0,0,0.26458333,0,87)" /></g>',
		'<g inkscape:label="Calque 2" inkscape:groupmode="layer" transform="translate(0,-87)">',
		'<path class="allforms FaceTop" ',
		'd="m 83.9339,127.74737 c 10.17187,1.56681 7.70973,49.64069 0.2114,51.86655 -2.444574,2.59776 -67.743677,-3.3135 -67.782862,2.56008 l -0.283578,42.50685 c 10.13456,-17.7821 46.292584,-10.94517 54.263444,1.10437 -10.35839,-23.21621 9.31397,-34.86784 22.32089,-34.86784 5.88178,0.0125 11.127726,1.94943 15.467566,6.25209 0.92828,-1.81826 2.89064,-0.17919 1.51124,-2.93692 -3.2402,-2.78819 -11.917736,-20.33874 -5.1531,-43.79124 4.14101,-10.9304 22.56959,-24.88251 32.0451,-21.58722 l 1.10672,-0.0249 h 3.64348 c 0,0 1.89012,-1.49221 0.14922,-2.54919 -1.74091,-1.04454 -3.34504,-0.89532 -3.34504,-2.99684 0,-2.10152 -2.2383,-17.54585 -20.95304,-24.12399 -10.42057,-3.65592 -42.343891,-3.240514 -42.343891,-3.240514 -22.53477,0.293148 -30.740543,0.03989 -54.284495,0.403474 -8.89101,0.93132 -5.25598,10.89678 -0.98403,10.64742 l 63.75352,-0.38329 c 6.14627,0.27618 5.76866,10.21076 1.34128,9.72083 0,0 -43.67883,-0.42976 -64.10264,0.19896 -8.26743,0.25442 -5.26101,10.77483 -0.22383,10.85579 21.21182,0.34072 63.64254,0.38548 63.64254,0.38548 z" ',
		'style="stroke:#070000;stroke-width:1" ',
		'inkscape:connector-curvature="0" /></g>',
		'<g inkscape:label="Calque 3" inkscape:groupmode="layer">',
		'<ellipse class="allforms DiskTop" ry="34.064949" rx="33.799999" cy="173.71429" cx="42.333332" ',
		'style="stroke:#000000;stroke-width:1" /></g>',
		'<g inkscape:label="Calque 4" inkscape:groupmode="layer">',
		'<ellipse class="allforms DiskBottom" ',
		'style="stroke:#000000;stroke-width:0.08862665" ',
		'cx="42.333332" cy="173.71429" rx="22.728659" ry="22.906822" /></g>',
*/
		'</svg>'
		));
	}

	// order color : background, face bottom, face top, disk bottom, disk top
	// order speed : background, face bottom, face top, disk bottom, disk top
	function _renderStyle(uint id) internal pure returns (string memory) {
		//colorsSVG[id] = colors;
		//speedsSVG[id] = speeds;
		return string(abi.encodePacked(
		'<style type="text/css">',
		'.allforms {fill-opacity:1;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1}',
		'.backColor {animation: colorBack 5s linear infinite;} ',
		'@keyframes colorBack { 0% {fill: #04006C;} 50% {fill: #2830FF;} 100% {fill: #04006C;} } ',
		'.FaceBottom {animation: FaceBottomColor 5s linear infinite;} ',
		'@keyframes FaceBottomColor { 0% {fill: #04006C;} 50% {fill: #00FFE8;} 100% {fill: #04006C;} } ',
		'.FaceTop {animation: FaceTopColor 5s linear infinite;} ',
		'@keyframes FaceTopColor { 0% {fill: #04006C;} 50% {fill: #EE0C0E;} 100% {fill: #04006C;} } ',
		'.DiskBottom {animation: DiskBottomColor 5s linear infinite;} ',
		'@keyframes DiskBottomColor { 0% {fill: #04006C;} 50% {fill: #FAEBF0;} 100% {fill: #04006C;} } ',
		'.DiskTop {animation: DiskTopColor 5s linear infinite;} ',
		'@keyframes DiskTopColor { 0% {fill: #04006C;} 50% {fill: #CFF0EB;} 100% {fill: #04006C;} } ',
			'</style>'
		));
	}

}
