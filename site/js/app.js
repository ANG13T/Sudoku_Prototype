/* 
    Quick-n-dirty demo page for Sudoku.js.
    For more information, please see https://github.com/robatron/sudoku.js
*/


// Selectors
var BOARD_SEL = "#sudoku-board";
var TABS_SEL = "#generator-tabs";
var MESSAGE_SEL = "#message";
var PUZZLE_CONTROLS_SEL = "#puzzle-controls";
var IMPORT_CONTROLS_SEL = "#import-controls";
var SOLVER_CONTROLS_SEL = "#solver-controls";
var solution;
let time;
let mistakes = 0;
let timer = $('#time');
let watch = new StopWatch(timer);
$('#mistakes').text(`Mistakes: ${mistakes} / 3`);

// Timer Stuff


// Boards
// TODO: Cache puzzles as strings instead of grids to cut down on conversions?
var boards = {
    "easy": null,
    "medium": null,
    "hard": null,
    "very-hard": null,
    "insane": null,
    "inhuman": null,
    "import": null,
};


var build_board = function(){
    /* Build the Sudoku board markup
    
    TODO: Hardcode the result
    */
    for(var r = 0; r < 9; ++r){
        var $row = $("<tr/>", {});
        for(var c = 0; c < 9; ++c){
            var $square = $("<td/>", {});
            if(c % 3 == 2 && c != 8){
                $square.addClass("border-right");
            }
            $square.append(
                $("<input/>", {
                    id: "row" + r + "-col" + c,
                    class: "square",
                    maxlength: "9",
                    type: "text"
                })
            );
            $row.append($square);
        }
        if(r % 3 == 2 && r != 8){
            $row.addClass("border-bottom");
        }
        $(BOARD_SEL).append($row);
    }
};

var init_board = function(){
    /* Initialize board interactions
    */
    $(BOARD_SEL + " input.square").change(function(){
        /* Resize font size in each square depending on how many characters are
        in it.
        */
        var $square = $(this);
        var nr_digits = $square.val().length;
        var font_size = "40px";
        if(nr_digits === 3){
            font_size = "35px";
        } else if(nr_digits === 4){
            font_size = "25px";
        } else if(nr_digits === 5){
            font_size = "20px";
        } else if(nr_digits === 6){
            font_size = "17px";
        } else if(nr_digits === 7){
            font_size = "14px";
        } else if(nr_digits === 8){
            font_size = "13px";
        } else if(nr_digits >= 9){
            font_size = "11px";
        }
        $(this).css("font-size", font_size);
    });
    $(BOARD_SEL + " input.square").keyup(function(){
        /* Fire a change event on keyup, enforce digits
        */
       let input = $(this).val();
       let thisID = $(this).attr("id");
       let row = parseInt(thisID[3]);
       let col = parseInt(thisID[8]);
       let index = (row * 9) + col;
       let solutionPiece = parseInt(solution[index]);

       if(parseInt(input)){
        let num = parseInt(input);
        if(num != solutionPiece){ //incorrect
            $(this).css('color', 'red');
            mistakes++;
            updateMistake();
        }else{
            $(this).css('color', 'black');
            if(checkWon()){
                alert('Game won')
            }
        }
       }
       
    });

};

function updateMistake(){
    if(mistakes >= 3){
       watch.stop();
       $('#gameoverModal').modal('show')

    }else{
        $('#mistakes').text(`Mistakes: ${mistakes} / 3`);
    }
}

var init_message = function(){
    /* Initialize the message bar
    */
    
    //Hide initially
    $(MESSAGE_SEL).hide();
}

function checkWon(){
    let value = true;
    $('.square').each(function(i, obj) {
        var values = $(this).attr("id");
        var textInside = $(this).val();
        // console.log(values);
        console.log(textInside);
        if(values == ' ' || value == '') {
            value = false;
        }
        let row = parseInt(values[3]);
        let col = parseInt(values[8]);
        let index = (row * 9) + col;
        if(textInside != solution[row][col]) {
            value = false;
        }
    });
    return value;
}

var show_puzzle = function(puzzle, refresh){
    /* Show the puzzle of the specified puzzle. If the board has not been
    generated yet, generate a new one and save. Optionally, set `refresh` to 
    force a refresh of the specified puzzle.
    */
    
    // default refresh to false
    refresh = refresh || false;
    
    // If not a valid puzzle, default -> "easy"
    if(typeof boards[puzzle] === "undefined"){
        puzzle = "easy";
    }

    let generatedPuzzle = sudoku.generate(puzzle);
    solution = sudoku.solve(generatedPuzzle);
    
    boards[puzzle] = sudoku.board_string_to_grid(generatedPuzzle);
    // Display the puzzle
    display_puzzle(boards[puzzle]);
}

var display_puzzle = function(board, highlight){
    /* Display a Sudoku puzzle on the board, optionally highlighting the new
    values, with green if `highlight` is set. Additionally do not disable the
    new value squares.
    */
    for(var r = 0; r < 9; ++r){
        for(var c = 0; c < 9; ++c){
            var $square = $(BOARD_SEL + " input#row" + r + "-col" + c);
            $square.removeClass("green-text");
            console.log(sudoku.BLANK_CHAR);
            if(board[r][c] != sudoku.BLANK_CHAR){

                $square.attr("disabled", "disabled");
                var board_val = board[r][c];
                var square_val = $square.val();
                if(highlight && board_val != square_val){
                    $square.addClass("green-text");
                }
                $square.val(board_val);
            } else {
                $square.val('');
            }
            // Fire off a change event on the square
            $square.change();
        }
    }
};



// "Main" (document ready)
$(function(){
    build_board();
    init_board();
    init_message();
    
    // Initialize tooltips
    $("[rel='tooltip']").tooltip();
    
    // Start with generating an easy puzzle
    let playValue = sessionStorage.getItem("playValue");
    show_puzzle(playValue);
    watch.start();
    
    // Hide the loading screen, show the app
    $("#app-wrap").removeClass("hidden");
    $("#loading").addClass("hidden");
});