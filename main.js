/*
=====================================
    Inital Variables
=====================================
*/

var cells = document.getElementsByClassName('item'); // represents an array of DOM cells
var storyboard = document.getElementById('result'); // storyboard shows the game status
var reset = document.getElementById('reset');// the blue reset button

var symbol = 'X'; // current Symbol whether its X or O
var filledCells = 0;

//virtual cells represents the virtual 2D Array of the cells so we can find out the winner
var virtualCells = [
    ['','',''],
    ['','',''],
    ['','','']    
];

var finished = false; // shows whether the game is finished or not
var result = ""; // keep track of the game result

var sign = function(cell){
    var id = cell.id;
    id = id.split('-');
    var x = Number(id[0]);
    var y = Number(id[1]);

    virtualCells[x][y] = symbol;
    filledCells++;
};

// This will paint the symbol inside the cell
var paint = function(cell){
    cell.innerHTML = symbol;
    sign(cell); // this will sign the symbol inside the virtual cells 2D array
};

//Toggle the current Symbol between X and O
var changeSymbol = function(){
    if(symbol == 'X'){
        symbol = 'O';
    }else{
        symbol = 'X';
    }
};


// This function will check if a player has won any possible way after each click 
// params [the current row , the current column , the first Diagonal , the second Diagonal]

var check = function(row , column , firstD , secondD){
    // check if the current row won
    var rowWinner = row.every(function(value , index , arr){
        return (value == arr[0]) && (value != "");
    });

    // check if the current column won
    var columnWinner = column.every(function(value , index , arr){
        return (value == arr[0]) && (value != "");
    });

    // check if the firstDiagonal won
    var firstDWinner = firstD.every(function(value , index , arr){
        return (value == arr[0]) && (value != "");
    });

    // check if the second diagonal won
    var secondDWinner = secondD.every(function(value , index , arr){
        return (value == arr[0]) && (value != "");
    });

    //return the way players won 

    if(rowWinner)
        return [rowWinner , row[0] + ' Has Won By Row'];

    if(columnWinner)
        return [columnWinner , column[0] + ' Has Won By Column'];    

    if(firstDWinner)
        return [firstDWinner , firstD[0] + ' Has Won By First Diagonal'];    

    if(secondDWinner)
        return [secondDWinner , secondD[0] + ' Has Won By Second Diagonal'];


    //or return false if no one has won the game yet 
    return [false];
};  


// This function will determin if a player won the game using the help of the above check function
var winner = function(){
    var row = []; // the current row 
    var column = []; // the current column 
    var firstDiagonal = []; 
    var secondDiagonal = [];

    // two loops the will loop through the Virtual Cells 2D Array and fill the upper arrays based on each iteration
    // if someone one before all of the virtual cells has been filled then we will break out of this function by
    // returning the result
    
    for(var i = 0; i < virtualCells.length; i++){
        for(var j = 0; j < virtualCells[i].length; j++){
            row.push(virtualCells[i][j]);
            column.push(virtualCells[j][i]);
            firstDiagonal.push(virtualCells[j][j]);
        }
        secondDiagonal.push(virtualCells[0][2] , virtualCells[1][1] , virtualCells[2][0]);

        //check if someone has won the game
        var result = check(row , column , firstDiagonal , secondDiagonal);

        // return the result if yes and break out of the winner function
        if(result[0]){
            return result;
        }

        //reinitialize the placeholder arrays
        row = [];
        column = [];
        firstDiagonal = [];
        secondDiagonal = [];
    }

    //check if all of the cells has been filled and no one won yet so we return a tie otherwise the game stills in progress
    if(filledCells === 9)
        return [true , 'it is a Tie'];
    else
        return [false , 'Still Calculating'];
};


// this function will remove the event from each cell in the DOM so they will be not clickable any more unless the game is reset
var destruct = function(){
    for(var i = 0; i < cells.length;i++){
        cells[i].removeEventListener('click' , job);
    }
};

// check if the game has finished or not yet 
var hasFinished = function(){
    if(filledCells >= 4){
        result = winner();
        storyboard.innerHTML = result[1];
        if(result[0])
            destruct();
    }
};


// this will be the job attached to each DOM cell when clicked
var job = function(){
    paint(this);
    changeSymbol();
    hasFinished();
};

//annonymous function to initalize each DOM Cell with its job
(function(){
    for(var i = 0; i < cells.length;i++){
        cells[i].addEventListener('click' , job);
    }
})();

// when clicked the page will reload 
// it's not the best reset way but its fast and do the job
reset.addEventListener('click' , function(){
    location.reload();
});

