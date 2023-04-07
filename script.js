const gameBoard = document.querySelector("#gameBoard");
const digits = document.querySelector("#digits");
const deleteNum = document.querySelector("#delete");
const mistake = document.querySelector("#mistake");
let lastSelected = null;
let error = 0;

function generateSudoku() {
   let board = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0));
   generateHelper(board, 0, 0);
   let emptyBoxes = 50; // set the number of empty boxes
   while (emptyBoxes > 0) {
     let row = Math.floor(Math.random() * 9);
     let col = Math.floor(Math.random() * 9);
     if (board[row][col] !== 0) {
       board[row][col] = 0;
       emptyBoxes--;
     }
   }
   return board;
 }
 
 function generateHelper(board, row, col) {
   if (row === 9) {
     return true;
   }
   
   let nextRow = col === 8 ? row + 1 : row;
   let nextCol = col === 8 ? 0 : col + 1;
   
   let nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
   for (let num of nums) {
     if (isValid(board, row, col, num)) {
       if(num<=9) board[row][col] = num;
       else board[row][col] = 0;
       if (generateHelper(board, nextRow, nextCol)) {
         return true;
       }
       board[row][col] = 0;
     }
   }
   
   return false;
 }
 
 function shuffle(arr) {
   for (let i = arr.length - 1; i > 0; i--) {
     let j = Math.floor(Math.random() * (i + 1));
     [arr[i], arr[j]] = [arr[j], arr[i]];
   }
   return arr;
 }
 
 function isValid(board, row, col, num) {
   for (let i = 0; i < board.length; i++) {
     if (board[row][i] === num || board[i][col] === num) {
       return false;
     }
     let r = Math.floor(row / 3) * 3 + Math.floor(i / 3);
     let c = Math.floor(col / 3) * 3 + i % 3;
     if (board[r][c] === num) {
       return false;
     }
   }
   
   return true;
 }


 function solveSudoku(board) {
   // Find the next empty cell
   let emptyCell = findEmptyCell(board);
   if (!emptyCell) {
     // The board is solved
     return true;
   }
 
   let [row, col] = emptyCell;
   for (let num = 1; num <= 9; num++) {
     if (isValid(board, row, col, num)) {
       board[row][col] = num;
       if (solveSudoku(board)) {
         // The board is solved
         return true;
       }
       // Backtrack
       board[row][col] = 0;
     }
   }
 
   // The puzzle can't be solved
   return false;
 }
 
 function findEmptyCell(board) {
   for (let row = 0; row < 9; row++) {
     for (let col = 0; col < 9; col++) {
       if (board[row][col] === 0) {
         return [row, col];
       }
     }
   }
   // All cells are filled
   return null;
 }
 
 function isValid(board, row, col, num) {
   // Check row and column
   for (let i = 0; i < 9; i++) {
     if (board[row][i] === num || board[i][col] === num) {
       return false;
     }
   }
   
   // Check subgrid
   let subgridRow = Math.floor(row / 3) * 3;
   let subgridCol = Math.floor(col / 3) * 3;
   for (let i = subgridRow; i < subgridRow + 3; i++) {
     for (let j = subgridCol; j < subgridCol + 3; j++) {
       if (board[i][j] === num) {
         return false;
       }
     }
   }
   // The number is valid in this cell
   return true;
 }

const puzzle = generateSudoku();
const solution = puzzle.map((row)=>[...row]);
solveSudoku(solution)
console.log("puzzle"+puzzle)
console.log("solution"+solution)

//puzzle
/*const puzzle = [
   "8-6-1----",
   "--3-64-9-",
   "9-----816",
   "-8-396---",
   "7-2-4-3-9",
   "---572-8-",
   "521-----4",
   "-3-75-2--",
   "----2-1-5",
];

//puzzle solution
const solution = [
   "856917423",
   "213864597",
   "947235816",
   "185396724",
   "762148359",
   "394572681",
   "521683974",
   "439751268",
   "678429135",
];*/

//when window load puzzle create
window.onload = (() => {
   for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
         const div = document.createElement("div");
         div.classList.add("tile");
         div.addEventListener("click", selectTile);
         div.setAttribute("row", i);
         div.setAttribute("col", j);


         if (puzzle[i][j] != 0) {
            div.innerText = puzzle[i][j];
            div.classList.add("filled");
         }

         if (i == 2 || i == 5) {
            div.classList.add("border-bottom");
         }

         if (j == 2 || j == 5) {
            div.classList.add("border-right");
         }
         gameBoard.appendChild(div);
      }
   }

   // creating digits
   for (let i = 0; i < 9; i++) {
      const div = document.createElement("div");
      div.classList.add("tile");
      div.addEventListener("click", addNumber);
      div.innerText = i + 1;
      div.style.height = gameBoard.querySelector(".tile").clientHeight + "px";
      digits.appendChild(div);
   }
});

//select Tile
function selectTile() {
   if (lastSelected != null) {
      lastSelected.classList.remove("select-tile");
   }
   lastSelected = this;
   lastSelected.classList.add("select-tile");
}

//add digits (0-9) to Tile
function addNumber() {
   if (lastSelected.innerText == "" || lastSelected.classList.contains("danger")) {
      lastSelected.innerText = this.innerText;
   }

   let row = lastSelected.getAttribute("row");
   let col = lastSelected.getAttribute("col");
   if (solution[row][col] == lastSelected.innerText) {
      lastSelected.classList.remove("danger");

   } else {
      lastSelected.classList.add("danger");
      addErrorandDisplay();
   }

   if (error > 20) {
      alert("You Lost!");
      location.reload();
   }

   if (isAllTilesFilled()) {
      const allTiles = gameBoard.querySelectorAll(".tile");
      let userAnswer = [...allTiles].map((tile) => {
         return tile.innerText;
      });
      let num = 0;
      for (let i = 0; i < 9; i++) {
         for (let j = 0; j < 9; j++) {
            if (solution[i][j] != userAnswer[num]) {
               allTiles[num].classList.add("danger");
            }
            num++
         }
      }

      let dangerClass = [...allTiles].some((tile) => {
         return tile.classList.contains("danger");
      });

      if (dangerClass) {
         if (error > 20) {
            alert("you lost!");
            location.reload();
         }
      } else {
         location.href = "https://cdn.dribbble.com/users/311928/screenshots/6574034/congrats1.png";
         alert("Congratuations! You win the puzzle!");
      }
   }
}

//delete number of Tile
deleteNum.onclick = () => {
   if (!lastSelected.classList.contains("filled")) {
      lastSelected.innerText = "";

   }
}

//check again any wrong numbers in any tile
function addErrorandDisplay() {
   error++;
   mistake.innerText = error;
}

//check all tiles filled or not
function isAllTilesFilled() {
   const allTiles = gameBoard.querySelectorAll(".tile");
   return [...allTiles].every((tile) => {
      return tile.innerText != "";
   });
}
