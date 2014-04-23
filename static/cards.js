

window.onload = function(){
shuffle(); //shuffle deck when page reloads

//checks if the player is a new player
if (typeof(localStorage.player) == 'undefined'){
    user = prompt("Please enter your name"); 
    
    if (user!=null) { 
    $('welcome').innerHTML = "<h1>Welcome " + user + "!</h1>"; 

//stores new player information
      localStorage.player=JSON.stringify(
    {   
        name: user,
        turns: 0
    })
 
}//end if 
} //end if  

//if the player information has already been set, page loads info from localStorage
 else{
    user = JSON.parse(localStorage.player)['name'];
    $('welcome').innerHTML = "<h1>Welcome back " + user + "!</h1>";
    } //end else

//places play info into a variable for itself
var playerdata = JSON.parse(localStorage.player); 

//check if user has played before and adjust game accordingly
if (playerdata['turns'] != 0){
    count = playerdata['turns'];
    $('hand').innerHTML = playerdata['prog'];
  }//end if
  else{
    count = 0;  
    } //end else

//if save button have been clicked then player's info is saved
$('save').addEventListener("click", function(){
    progress = $('hand').innerHTML;
    playerdata.prog = progress;
    playerdata.turns = count;
    
    //place everything into the localStorage info
    localStorage.player=JSON.stringify(playerdata);

    alert("Your progress have been saved! When you return, you will start exactly where you left off!");    
    })
} //end of window.onload function 

var F = function(e){

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
            count++;
        };

//cards are compared     
    if(card1&&!card2&&card1!=e&&card1.innerHTML==e.innerHTML){
        //if it matches then keep them flipped and play a match audio
        card1.className = 'w p';
        e.className = 'w p';
        var match = new Audio('http://www.freesound.org/data/previews/131/131660_2398403-lq.mp3');
            match.play();
            }
    else {
        e.classList.add('v');
        }


//check if you have completed the game - all cards are turned over or matched
    if(document.body.getElementsByClassName('p').length == 16){
        //play audio and alert user that they have won the game      
        var win = new Audio('http://audiomicro-dev.s3.amazonaws.com/preview/532096/e3d80dbecad1674');
            win.play();
        alert("You Win!");

    //reset the game
        startover = document.body.getElementsByClassName('w');
        for (var i = 0; i < startover.length; i++) {
            startover[i].className = "w";
        };

    //reset the count and then update the playerdata and localStorage
            count = 0;
            playerdata.turns = count;
            playerdata.win += 1;
            localStorage.player=JSON.stringify(playerdata);

            }
    
 
 //check if the player has ran out of turns and resets the game   
    if (count==24){
        //play audio and alert user that they have lost the game 
        var lose = new Audio('http://2.s3.envato.com/files/42887508/preview.mp3');
        lose.play();
        alert("Sorry! Try Again.");

        //turn everything back over and reset the game
        startover = document.body.getElementsByClassName('w');
        for (var i = 0; i < startover.length; i++) {
            startover[i].className = "w";
        };
        
    //reset the count, update the playerdata and localStorage and shuffle cards
        count = 0;
        playerdata.turns = count;
        playerdata.lose += 1;
        localStorage.player=JSON.stringify(playerdata);
        shuffle();
    }

    
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
