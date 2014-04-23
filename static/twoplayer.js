var loggeduser;
window.onload = function(){
shuffle(); //shuffle deck when page reloads

if ($('playerloggedname') == null){
    // player1();
    //checks if the player is a new player
    var gamestats = {
        prog: $('hand').innerHTML,
        cplayer: 0
    };

    localStorage.gamestats = JSON.stringify(gamestats);
    player1();
    player2();  
    playfirst();
}
else{
    loggeduser = $('playerloggedname').innerHTML;
}


if ($('playerloggedname') != null && typeof(localStorage.gamestats) == 'undefined'){
   loggeduser = $('playerloggedname').innerHTML;
    //checks if the player is a new player
    var gamestats = {
        prog: $('hand').innerHTML,
        cplayer: 0
    };

    localStorage.gamestats = JSON.stringify(gamestats);
    player1();
    player2();  
    playfirst();
}
else if (typeof(localStorage.gamestats) != 'undefined'){
    gamestats = JSON.parse(localStorage.gamestats);
    $('hand').innerHTML = gamestats['prog'];
    player1info = JSON.parse(localStorage.player1stats);
    if ($('playerloggedname')){player1info['username'] = $('playerloggedname').innerHTML;localStorage.player1stats = JSON.stringify(player1info);}
    player2(); 
    playfirst();
    
}
//if save button have been clicked then player's info is saved
$('save').addEventListener("click", function(){
    
      gamestats['prog'] = $('hand').innerHTML;
      gamestats['cplayer'] = currentplayer['gamer'];

    
    //place everything into the localStorage info
    localStorage.gamestats = JSON.stringify(gamestats);
    alert("Game Saved!");    
    });


$('newgame').addEventListener("click", function(){
        var r = confirm("Are you sure you want to quit?");
    if (r == true)
      {
        if (currentplayer['gamer'] == 1){
            currentplayer['turns'] = 0;
            currentplayer['lose'] += 1;
            localStorage.player1stats = JSON.stringify(currentplayer);

            //update other player's info
            player2stats['turns'] = 0;
            player2stats['win'] += 1;
            localStorage.player2stats = JSON.stringify(player2stats);
        }
      newg();
      }     
    });

$('stats').addEventListener("click", function(){
     alert('Player: ' + currentplayer['username'] 
            + '\n' + 'Wins: ' + currentplayer['win'] + ' times' +
            '\n' + 'Lose: ' + currentplayer['lose'] + ' times');
    });
} //end of window.onload function 

var loginuser = function(){
    if($('playerloggedname')!= null){
    cu = JSON.parse(localStorage.cuplayer);
    if (cu['player']==1){
        if (currentplayer['gamer'] == 1){
                currentplayer['username'] = $('playerloggedname').innerHTML;
                localStorage.player1stats = JSON.stringify(currentplayer);
        }
        else{
                currentplayer['username'] = $('playerloggedname').innerHTML;
                localStorage.player1stats = JSON.stringify(currentplayer);
        }
    }
}
}


var F = function(e){
loginuser();
//each time a card is clicked, the sound for it flipping is played
    var flip = new Audio('/static/card_flip.mp3');
            flip.play();
 
 //each card is then flipped      
    var class_array = document.body.getElementsByClassName('v');
    
    card1 = class_array[0];
    card2 = class_array[1];

//this is done to ensure that not more than 2 cards are turned at any one time   
    if (card2) {
            card1.classList.remove('v');
            card2.classList.remove('v');
            currentplayer['turns'] += 1;
        }

    if ((card2) && card1.innerHTML != card2.innerHTML){
            switchturn();
            }
        //cards are compared     
    else if ((card1) && card1.innerHTML == e.innerHTML){
        //if it matches then keep them flipped and play a match audio
        card1.className = 'w p';
        e.className = 'w p';
        currentplayer['match'] += 1;
        var match = new Audio('http://www.freesound.org/data/previews/131/131660_2398403-lq.mp3');
            match.play();
            }

    else{
        
        e.classList.add('v');

        }

    win();
   
}

function shuffle(){
        var numArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
        var puzzle = document.body.getElementsByClassName('w');
        
        for (var i=puzzle.length; i>0; i){
            var j = Math.floor(Math.random() * i);
            var x = numArray[--i];
            var test = puzzle[i].innerHTML;
            
            puzzle[i].innerHTML = puzzle[numArray[j]].innerHTML;
            puzzle[numArray[j]].innerHTML = test;
            numArray[j] = x;
    }
}

function lose(){

    //check if the player has ran out of turns and resets the game   
    
        //play audio and alert user that they have lost the game 
        var lose = new Audio('http://2.s3.envato.com/files/42887508/preview.mp3');
        lose.play();
        alert("Sorry! Try Again.");

        //reset the count and then update the playerdata and localStorage
            count = 0;
            playerdata.turns = count;
            playerdata['lose'] += 1;
            localStorage.player=JSON.stringify(playerdata);

        newg();
}

function win(){

//check if you have completed the game - all cards are turned over or matched
    if(document.body.getElementsByClassName('p').length == 16){
        //play audio and alert user that they have won the game      
        var win = new Audio('http://audiomicro-dev.s3.amazonaws.com/preview/532096/e3d80dbecad1674');
            win.play();

        //save game info first
        if (currentplayer['player'] == 1){
            localStorage.currentplayer=JSON.stringify(player1stats);
            }
        else{
            localStorage.currentplayer=JSON.stringify(player2stats);
        }
        //check who has most turns
        p1 = JSON.parse(localStorage.player1stats);
        p2 = JSON.parse(localStorage.player2stats);

        if (p1['match'] < p2['match']){
            p2['win'] += 1;
            p1['lose'] +=1;
            alert(p2['username'] + " Win!");
        }
        else if (p1['match'] == p2['match']){
            alert("It's a tie!");
        }
        else if (p1['match'] > p2['match']){
            p1['win'] += 1;
            p2['lose'] +=1;
            alert(p1['username'] + " Win!");
        
        }

    //reset the count and then update the playerdata and localStorage
            p1['turns'] = 0; p1['match'] = 0; localStorage.player1stats = JSON.stringify(p1);
            p2['turns'] = 0; p2['match'] = 0; localStorage.player2stats = JSON.stringify(p2);
            currentplayer['turns'] = 0; 
            currentplayer['match'] = 0;
       newg();

            }
}

function newg(){
    //reset the game
        startover = document.body.getElementsByClassName('w');
        for (var i = 0; i < startover.length; i++) {
            startover[i].className = "w";
        };

    shuffle();
}


function player1(){
    if (loggeduser){
            player1stats = {
            username: loggeduser,
            turns: 0,
            win: 0,
            lose: 0,
            gamer: 1,
            match: 0
                };
        localStorage.player1stats = JSON.stringify(player1stats);
        }
    
    else if (!loggeduser){
        player1_username = prompt("Player 1 Name:", "Player 1");

        if (player1_username == null){
        player1_username = "Player 1";
            }
    
        player1stats = {
            username: player1_username,
            turns: 0,
            win: 0,
            lose: 0,
            gamer: 1,
            match: 0
                };
        localStorage.player1stats = JSON.stringify(player1stats);
    }

    else{
        playfirst();
    }
}


function player2(){
    if (typeof(localStorage.player2stats) == 'undefined'){
        player2_username = prompt("Player 2 Name:", "Player 2");

        if (player2_username == null){
        player2_username = "Player 2";
            };
    
        player2stats = {
            username: player2_username,
            turns: 0,
            win: 0,
            lose: 0,
            gamer: 2,
            match: 0
                };
        localStorage.player2stats = JSON.stringify(player2stats);
    }

    else{
        playfirst();
    }
}


function playfirst(){
    //randomly choose who goes first
firstplayer = Math.floor(Math.random() * 2) + 1;
 //check if its player 1 or player 2 is first
if (firstplayer == 1){
    currentplayer = JSON.parse(localStorage.player1stats);
    $('playerturn').innerHTML = "<h1>" + currentplayer['username'] + "'s Turn!";
}
else{
    currentplayer = JSON.parse(localStorage.player2stats);
    $('playerturn').innerHTML = "<h1>" + currentplayer['username'] + "'s Turn!";
}
localStorage.cuplayer=JSON.stringify(
    {   
        player: currentplayer['gamer']
    });
}

function switchturn(){

        //switch players
        play = currentplayer['gamer'];
        if (play == 1){
            localStorage.player1stats = JSON.stringify(currentplayer);
            currentplayer = JSON.parse(localStorage.player2stats);
            $('playerturn').innerHTML = "<h1>" + currentplayer['username'] + "'s Turn!";
         }
        else {
            localStorage.player2stats = JSON.stringify(currentplayer);
            currentplayer = JSON.parse(localStorage.player1stats);
            $('playerturn').innerHTML = "<h1>" + currentplayer['username'] + "'s Turn!";
            }
    localStorage.cuplayer=JSON.stringify(
    {   
        player: currentplayer['gamer']
    });
    gamestats = {
        prog: $('hand').innerHTML,
        cplayer: currentplayer['gamer']
    };

    localStorage.gamestats = JSON.stringify(gamestats);
}
