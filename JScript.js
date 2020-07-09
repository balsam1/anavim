var ballsNumber;
var gameTbl;
var scoreTbl;
var trueClick = false;
var numberOfPlayers;
var currentPlyr = 0;
var clickedToMark = false;
var markedCount = 0;
var markedAttr = new Array();
var attributes = [["sl", "-1"], ["rl", "-2"], ["lr", "-4"]];
var markedBalls = new Array();
var plyrAlreadyFilled = false;
var gameEndCounter = 0;

$(document).ready(function () {

    // Change background when in textbox
    $("input").focus(function () {
        $(this).addClass("mouseInTextbox");
    });
    $("input").focusout(function () {
        $(this).removeClass("mouseInTextbox");
    });

    // Prepare Game
    $('button').click(function () {
        // Validate Number Of Players
        if ($('input:eq(0)').val() == "" || $('input:eq(1)').val() == "") {
            alert("שני שחקנים לפחות");
            return;
        }

        if ($('input:eq(4)').val() > 15 || $('input:eq(4)').val() < 3) {
            alert("לא פחות מ-3, לא יותר מ-15");
            return;
        }

        // If OK:
        PrepareScoreBoard();
        PrepareGameBoard();

        $('#startPanel').slideUp('fast');
        $('<div id="gameBoard" align="center">' + gameTbl + '</div>').insertAfter('#startPanel').hide().slideDown(1000);
        $('<div><br /><br /><br /><div>').insertBefore('#gameBoard').hide().slideDown('slow');

        $('#scorePanel').html(scoreTbl).fadeIn('slow');

        $('img:eq(0)').click();
        $('img:eq(' + (ballsNumber - 1) + ')').click();
        $('img:eq(' + ($('img').length - 3) + ')').click();

        trueClick = true;

        $('.currentPlayer').animate({ fontSize: '+=12px' }, 1000);

        $('.controls').fadeIn(1500);
    });

    // Hovering on controls
    $('.controls').hover(function () {
        $(this).animate({ 'width': '+=20' }, 150);
    }, function () {
        $(this).animate({ 'width': '-=20' }, 150);
    });

    // Player clicks on MarkLine
    $('#MarkLine').click(function () {
        $('body').css({ 'cursor': 'crosshair' });
        clickedToMark = true;
    });

    // Hovering on balls
    $('#gameBoard img.filled').live('mouseover', function () {
        //if ($(this).not('.marked')) 
        $(this).css('border', '2px solid #FF0000');

    });
    $('#gameBoard img.filled').live('mouseout', function () {
        //if ($(this).not('.marked'))
        $(this).css('border', '2px solid #FFFFF0'); // No border
    });

    // Player clicks on filled ball to mark it
    $('.filled').live('click', function (e) {
        if (clickedToMark) {
            markedCount++;

            if (markedCount == 1)
                markedAttr = [];

            // Get sl, rl, lr attributes
            for (var i = 0; i < 3; i++) {
                markedAttr.push($(this).attr(attributes[i][0]));
            }

            // Mark it 
            $(this).removeClass('filled').addClass('marked').css('border', '2px solid #FF0000'); // Red border
            markedBalls[markedCount] = $(this);

            if (markedCount == 2) {
                $('body').css({ 'cursor': 'default' });
                clickedToMark = false;
                markedCount = 0;
                CheckMarkedLine(e);
            }


        }
    });

    // Player clicks on NextOne
    $('#NextOne').click(function () {
        $('body').css({ 'cursor': 'default' });

        // Check for winner
        if (gameEndCounter == ($('#gameBoard img').length - 3))
            TheEnd();

        // Move to next player
        if (trueClick) {

            // Check that one ball was marked
            if (!plyrAlreadyFilled)
                return;
            else
                plyrAlreadyFilled = false;

            if ((currentPlyr + 1) == numberOfPlayers)
                currentPlyr = -1;

            // Decrease font size
            $('.currentPlayer')
                .animate({ fontSize: '-=12px' }, 500)
                .removeClass('currentPlayer')
                .addClass('player');

            // Increase font size
            $('.player:eq(' + (++currentPlyr) + ')')
                .animate({ fontSize: '+=12px' }, 500)
                .removeClass('player')
                .addClass('currentPlayer');
        }
    });


    // Player Clicks On Balls
    $('.empty').live('click', function () {
        if (!plyrAlreadyFilled) {

            if (trueClick)
                plyrAlreadyFilled = true;

            $(this).attr('src', 'images/FilledBall.png')
               .removeClass('empty').addClass('filled')
               .hide()
               .fadeIn('slow');
        }
    });
});

function PrepareGameBoard() {
    ballsNumber = $('#maxNumber').val();

    var numberOfSpaces;

    gameTbl = "<table id='gamePanel'>";
    for (var i = ballsNumber; i > 0; i--) {
        gameTbl += "<tr>";

        numberOfSpaces = Math.abs(i - ballsNumber);
        for (var spaces = 0; spaces < numberOfSpaces; spaces++) {
            gameTbl += "<td>&nbsp;&nbsp;&nbsp;&nbsp;</td>";
        }

        for (var j = 0; j < i; j++) {
                gameTbl += "<td><img src='images/HollowBall.png' width='30px' class='empty' "
                    + "sl='" + i.toString() + "' "
                    + "lr='" + (ballsNumber - j).toString() + "' "
                    + "rl='" + (j + 1 + numberOfSpaces).toString() + "' "
                    + " /></td><td>&nbsp;&nbsp;&nbsp;&nbsp;</td>";
            }
            gameTbl += "</tr>";
        }
        gameTbl += "</table>";

    }

    function PrepareScoreBoard() {
        var players = new Array();
        numberOfPlayers = 0;

        for (var i = 0; i < 4; i++) {
            players[i] = $('input:eq(' + i + ')').val();
        }

        scoreTbl = '<table align="center" width="100%"><tr>';
        for (var i = 0; i < 4; i++) {
            if (players[i] != "") {
                numberOfPlayers++;
                if (i == 0)
                    scoreTbl += '<td class="currentPlayer">' + players[i] + '</td>';
                else
                    scoreTbl += '<td class="player">' + players[i] + '</td>';
            }
        }

        scoreTbl += '</tr><tr>';

        for (var i = 0; i < numberOfPlayers; i++) {
            scoreTbl += '<td class="score">0</td>';
        }

        scoreTbl += '</tr></table>';
    }

    function CheckMarkedLine(e) {
        for (var i = 0; i < 3; i++) {
            if (markedAttr[i] == markedAttr[i + 3]) {
                var ballsInMarkedLine = markedAttr[i];
                markedCount = 0;
                var imgCounter = -1;
                var imgArray = new Array();
                $('#gameBoard img').each(function () {
                    imgCounter++;
                    if ($(this).attr(attributes[i][0]) == ballsInMarkedLine && ($(this).is('.filled') || $(this).is('.marked'))) {
                        imgArray.push(imgCounter);
                        markedCount++;
                    }
                });

                if (markedCount == ballsInMarkedLine) {

                    ResetParams();

                    for (var j = 0; j < ballsInMarkedLine; j++) {
                        $('#gameBoard img:eq(' + imgArray[j] + ')')
                        .attr(attributes[i][0], attributes[i][1]);
                        //.removeClass('filled')
                        //.addClass('marked');

                        // Calculate all attributes
                        // [["sl", "-1"], ["rl", "-2"], ["lr", "-4"]
                        var sl = $('#gameBoard img:eq(' + imgArray[j] + ')').attr('sl');
                        var rl = $('#gameBoard img:eq(' + imgArray[j] + ')').attr('rl');
                        var lr = $('#gameBoard img:eq(' + imgArray[j] + ')').attr('lr');

                        var calculate = 0;
                        if (parseInt(sl) < 0)
                            calculate += parseInt(sl);
                        if (parseInt(rl) < 0)
                            calculate += parseInt(rl);
                        if (parseInt(lr) < 0)
                            calculate += parseInt(lr);

                        // Using minus sign as tag of picture
                        $('#gameBoard img:eq(' + imgArray[j] + ')')
                        .attr('src', 'images/MarkedBall' + calculate + '.png');

                        if (calculate == -7)
                            gameEndCounter++;
                        
                    }

                    // Score PopUp and Update
                    $('.popUp').remove();
                    $('<p class="popUp">' + ballsInMarkedLine + '</p>').appendTo('body')
                    .css('top', (e.pageY - 30) + 'px')
                    .css('left', (e.pageX - 10) + 'px')
                    .animate({ 'top': '-=250', 'opacity': '0' }, 1600);

                    // Update Score 
                    var score = 0;
                    var str = $('.score:eq(' + currentPlyr + ')').text();
                    score = parseInt(str);
                    score += parseInt(ballsInMarkedLine);
                    $('.score:eq(' + currentPlyr + ')').text(score);
                    // ANIMATE IT

                    plyrAlreadyFilled = true;
                    $('#NextOne').click();

                    return;
                }              
            }
        }

        // No Match - reset everything take off borders
        ResetParams();
    }

    function ResetParams() {
        markedCount = 0;
        markedBalls[1].removeClass('marked').addClass('filled').css('border', '2px solid #FFFFF0');
        markedBalls[2].removeClass('marked').addClass('filled').css('border', '2px solid #FFFFF0');
    }

    function TheEnd() {
        // Who won?
        var winnerName;
        var winnerScore = 0;

        $('.currentPlayer').removeClass('currentPlayer').addClass('player');
        for (var i = 0; i < numberOfPlayers; i++) {
            if (parseInt($('.score:eq(' + i + ')').text()) > winnerScore) {
            winnerScore = parseInt($('.score:eq(' + i + ')').text());
            winnerName = $('.player:eq(' + i + ')').text();
            }
        }

    $('.controls').fadeOut(1100);
    $('#gameBoard').fadeOut(6000);

    // Declare Winner
    $('<div id="theWinner">המנצח הוא: ' + winnerName + '  --  כל הכבוד!</div>')
    .insertAfter('#gameBoard')    
    .hide();
    var left = ($(window).width() - $('#theWinner').width()) / 2;
    $('#theWinner')
    .fadeIn('slow')
    .css('left', left);
    $('<div id="trophy"><img src="images/trophy.gif" /></div>')
    .insertAfter('#theWinner');
    left = ($(window).width() - $('#trophy img').width()) / 2;
    $('#trophy img')
    .css('left', left)
    .animate({ 'width': '+=200px' }, 5000)
    .animate({ 'width': '-=200px' }, 5000);
    }