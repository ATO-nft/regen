//import {decode as base64_decode, encode as base64_encode} from 'base-64';

export default function createSvg(colors, speeds) {
	// copier header_svg
	let svgImage = '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">';
	// ajouter style_svg
	// ajouter body_svg
	svgImage += '<g class="rotate">' +
	'<g id="eye1">' +
		'<ellipse stroke-width="3" ry="29.5" rx="29.5" id="svg_1" cy="154.5" cx="181.5" stroke="#000" fill="#fff"/>' +
		'<ellipse ry="3.5" rx="2.5" id="svg_3" cy="154.5" cx="173.5" stroke-width="3" stroke="#000" fill="#000000"/>' +
	'</g>' +
	'<g id="head">' +
		'<ellipse fill="#ffffff' +
		'" stroke-width="3" cx="204.5" cy="211.80065" id="svg_5" rx="80' +
		'" ry="51.80065" stroke="#000"/>' +
	'</g>' +
	'<g id="eye2">' +
		'<ellipse stroke-width="3" ry="29.5" rx="29.5" id="svg_2" cy="168.5" cx="209.5" stroke="#000" fill="#fff"/>'+
		'<ellipse ry="3.5" rx="3" id="svg_4" cy="169.5" cx="208" stroke-width="3" fill="#000000" stroke="#000"/>'+
	'</g>'+
	'</g>';

	svgImage += '</svg>';
    
	//return svgImage;
	return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBjbGFzcz0icm90YXRlIj48ZyBpZD0iZXllMSI+PGVsbGlwc2Ugc3Ryb2tlLXdpZHRoPSIzIiByeT0iMjkuNSIgcng9IjI5LjUiIGlkPSJzdmdfMSIgY3k9IjE1NC41IiBjeD0iMTgxLjUiIHN0cm9rZT0iIzAwMCIgZmlsbD0iI2ZmZiIvPjxlbGxpcHNlIHJ5PSIzLjUiIHJ4PSIyLjUiIGlkPSJzdmdfMyIgY3k9IjE1NC41IiBjeD0iMTczLjUiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjMDAwMDAwIi8+PC9nPjxnIGlkPSJoZWFkIj48ZWxsaXBzZSBmaWxsPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjMiIGN4PSIyMDQuNSIgY3k9IjIxMS44MDA2NSIgaWQ9InN2Z181IiByeD0iODAiIHJ5PSI1MS44MDA2NSIgc3Ryb2tlPSIjMDAwIi8+PC9nPjxnIGlkPSJleWUyIj48ZWxsaXBzZSBzdHJva2Utd2lkdGg9IjMiIHJ5PSIyOS41IiByeD0iMjkuNSIgaWQ9InN2Z18yIiBjeT0iMTY4LjUiIGN4PSIyMDkuNSIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjZmZmIi8+PGVsbGlwc2Ugcnk9IjMuNSIgcng9IjMiIGlkPSJzdmdfNCIgY3k9IjE2OS41IiBjeD0iMjA4IiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIvPjwvZz48L2c+PC9zdmc+";
}