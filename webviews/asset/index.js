init();
function init() {
	let html = "";
	for (let i = 1; i <= 81; i++) {
		let editclass = "";
		if (i % 9 == 4 || i % 9 == 7) {
			editclass += "left";
		}
		let line = parseInt((i - 1) / 9);
		if (line == 3 || line == 6) {
			editclass += " top";
		}
		if (i % 9 == 1) {
			html += '<tr>';
		}
		html += '<td class="' + editclass + '"><input id="' + i + '" type="number" maxlength="1"></td>';
		if (i % 9 == 0) {
			html += '</tr>';
		}
	}
	document.getElementById('model').innerHTML = html;
}

function clc() {
	for (let i = 0; i < 81; i++) {
		document.getElementsByTagName("input")[i].value = "";
		document.getElementsByTagName("input")[i].style = "";
	}
}

function get_answer() {
	let bool = check_input();
	if (bool) {
		let grid = readAPuzzle();
		if (!isValidGrid(grid)) {
			alert("输入无效，请重试！(可能误输重复数字)");
		} else {
			if (search(grid)) {
				output_ans();
			} else {
				alert("找不到解决方案！(无解)");
			}
		}
	}
}

function check_input() {
	let arr = new Array();

	for (let i = 0; i < 81; i++) {
		arr[i] = Number(document.getElementsByTagName("input")[i].value);
		if (isNaN(arr[i])) {
			alert('输入应该是1到9之间的任何数字！');
			return false
		}
	}

	if (arr.every(function isZero(x) {
			return x == 0
		})) {
		alert('没有输入！');
		return false
	}

	return true
}

function readAPuzzle() {
	let arr = new Array();

	for (let i = 0; i < 81; i++) {
		arr[i] = Number(document.getElementsByTagName("input")[i].value);
		if (arr[i] != '') {
			document.getElementsByTagName("input")[i].style = "background: #fffacc;";
		}
	}
	let grid = new Array();
	for (let i = 0; i < 9; i++) {
		grid[i] = new Array();
		for (let j = 0; j < 9; j++) {
			grid[i][j] = 0;
		}
	}
	for (let i = 0; i < 81; i++) {
		grid[Math.floor(i / 9)][i % 9] = arr[i];
	}

	return grid
}

function getFreeCellList(grid) {
	let freeCellList = new Array();
	let index = 0

	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			if (grid[i][j] == 0) {
				freeCellList[index] = new Array(i, j);
				index++;
			}
		}
	}

	return freeCellList
}

function isValid(i, j, grid) {
	for (var column = 0; column < 9; column++) {
		if ((column != j) && (grid[i][column] == grid[i][j])) {
			return false
		}
	}
	for (var row = 0; row < 9; row++) {
		if ((row != i) && (grid[row][j] == grid[i][j])) {
			return false
		}
	}
	for (var row = Math.floor(i / 3) * 3; row < Math.floor(i / 3) * 3 + 3; row++) {
		for (var col = Math.floor(j / 3) * 3; col < Math.floor(j / 3) * 3 + 3; col++) {
			if ((row != i) && (col != j) && (grid[row][col] == grid[i][j])) {
				return false
			}
		}
	}

	return true
}

function isValidGrid(grid) {
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			if ((grid[i][j] < 0) || (grid[i][j] > 9) || ((grid[i][j] != 0) && (!isValid(i, j, grid)))) {
				return false
			}
		}
	}
	return true
}

function search(grid) {
	var freeCellList = getFreeCellList(grid);
	var numberOfFreeCells = freeCellList.length;
	if (numberOfFreeCells == 0) {
		return true
	}
	var k = 0;
	while (true) {
		var i = freeCellList[k][0];
		var j = freeCellList[k][1];
		if (grid[i][j] == 0) {
			grid[i][j] = 1;
		}

		if (isValid(i, j, grid)) {
			if (k + 1 == numberOfFreeCells) {
				return true;
			} else {
				k++;
			}
		} else {
			if (grid[i][j] < 9) {
				grid[i][j]++;
			} else {
				while (grid[i][j] == 9) {
					if (k == 0) {
						return false;
					}
					grid[i][j] = 0;
					k--;
					i = freeCellList[k][0];
					j = freeCellList[k][1];
				}
				grid[i][j]++;
			}
		}
	}

	return true;
}

function output_ans() {
	var grid = readAPuzzle();
	var grid_original = readAPuzzle();
	callnet();
	if (search(grid)) {
		for (var i = 0; i < 81; i++) {
			if (grid[Math.floor(i / 9)][i % 9] != grid_original[Math.floor(i / 9)][i % 9]) {
				document.getElementsByTagName("input")[i].value = grid[Math.floor(i / 9)][i % 9];
				document.getElementsByTagName("input")[i].style.color = '#21be70';
			}
		}
	}
}
