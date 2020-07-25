let playValue = "easy";
let game = sudoku.generate(60);
alert(game);

$(".form-check-input").click(function(){
    // Holds the product ID of the clicked element
    var playOption = $(this).attr("id");;
    playValue = playOption;
});
