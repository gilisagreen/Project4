window.onload = function() {
    
    //setViewParams();
    //game.me = JSON.parse(game.me)
    if(game.game_id == "") {
    showCreateNewGame();
    }
    else {
    game.other_player = game.other_player;
    openChannel();
    $('game_url').hide();
    game.i_am_player1 = false;
    game.myturn = false;
    $('player1_name').innerHTML = "<h1>Player1: "+game.other_player+"</h1>";
    $('player2_name').innerHTML = "<h1>Player2: "+game.user+"</h1>";
    var h = game.hand.split('&quot;');
    loopthrucards(h);
    showGame();
    }
};


/* SHOW ELEMENTS TO CREATE A NEW GAME */
var showCreateNewGame = function() {
    $('hand').hide();
    $('buttons').hide();
    $('start_new').show();
}


/* SHOW PLAYING GAME */
var showGame = function() {
    $('start_new').hide();
}

var generalcards = {};
var loopthrucards = function(h){
    var p = 3;
    for(var i=1; i < h.length; i+=4){
        generalcards[h[i]] = h[p];
        p+=4;
    }
}

var createNewGame = function() {
    //game.hame = hand;
    shuffle();
    collectCards();
    hand = JSON.stringify(cards);
    jQuery.post('/netplay/new', {'hand': hand},
       function(data) {
           newGame = JSON.parse(data);
           $('game_url').show();
           $('game_url').innerHTML = "<h1>Share this url: <a href='http://project4.gg620042465.appspot.com/netplay?game=" + newGame.game_id + "'>http://project4.gg620042465.appspot.com/netplay?game=" + newGame.game_id + "</a></h1>";
           game.token = newGame.token;
           game.i_am_player1 = true;
           $('player1_name').innerHTML = "<h1>Player1: "+game.user+"</h1>";
           game.game_id = newGame.game_id;
           openChannel();
           showGame();
       });
}

var playerJoined = function(user) {
    game.other_player = user;
    alert(game.other_player.name +' has joined the game!');
     $('hand').show();
    $('buttons').show();
    setTimeout("setJoinedUser()", 4000);   //a hack
}

var setJoinedUser = function() {
    $('game_url').hide();
    $('player2_name').innerHTML = "<h1>Player2: "+game.other_player.name+"</h1>";
    game.myturn = true;
    $('hand').show();
    $('buttons').show();
}

var updateReceived = function(data) {
    game.myturn = true;
}

var openChannel = function() {
    var channel = new goog.appengine.Channel(game.token);
    var handler = {
        'onopen': onOpened,
        'onmessage': onMessage,
        'onerror': function() {
        alert("The connection between you and other player seems to be broken...");
    },
        'onclose': function() {
            alert("Player has left!");

        }
    };
    var socket = channel.open(handler);
    socket.onopen = onOpened;
    socket.onmessage = onMessage;
};

var onOpened = function() {
};

var onMessage = function(msg) {
    message = JSON.parse(msg.data);
    if(message.type=="join") {
    playerJoined(message.user);
    }
    else if(message.type=='update') {
    updateReceived(message.update);
    }
    else if(message.type=='leave') {
        alert("leave");
    }
};



/* PLACE CARDS IN A JSON OBJECT */
var cards = {}; 
var collectCards = function(){
   
   var hand = document.getElementsByClassName('w');
    cardrow = ['Card1', 'Card2', 'Card3', 'Card4', 'Card5', 'Card6', 'Card7',
                    'Card8', 'Card9', 'Card10', 'Card11', 'Card12', 'Card13',
                    'Card14', 'Card15', 'Card16'];
    //var cardrow = new Array();
    for (var c=0; c<16; c++){        
            cards[cardrow[c]] = hand[c].getAttribute('class');
        }
    //alert(cards);
};


var visible = function(t){
    t.style.visibility = "visible";
}

/* GAME JAVASCRIPT */

var F = function(e){
    //sendMessage(this);
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
var puzzle =[];

/* SHUFFLE BOARD */
var shuffle = function(){
        var numArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
        puzzle = document.body.getElementsByClassName('w');
        
        for (var i=puzzle.length; i>0; i){
            var j = Math.floor(Math.random() * i);
            var x = numArray[--i];
            var test = puzzle[i];
            
            puzzle[i] = puzzle[numArray[j]];
            puzzle[numArray[j]] = test;
            numArray[j] = x;
    }
}


/* CHECK WHO WINS */
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

