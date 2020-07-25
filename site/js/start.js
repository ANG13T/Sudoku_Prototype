var playValue = "easy";
sessionStorage.setItem( 'playValue', playValue );
let board = [];
let solution = [];

$(".form-check-input").click(function(){
    // Holds the product ID of the clicked element
    var playOption = $(this).attr("id");
    playValue = playOption;
    sessionStorage.setItem( 'playValue', playValue );
});

