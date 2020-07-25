var playValue = "easy";
let board = [];
let solution = [];

$(".form-check-input").click(function(){
    // Holds the product ID of the clicked element
    var playOption = $(this).attr("id");;
    playValue = playOption;
});

$('#playButton').click(function(){
    board = sudoku.generate(playValue, true);
    solution = sudoku.solve(board);
    console.log("board", board);
})
