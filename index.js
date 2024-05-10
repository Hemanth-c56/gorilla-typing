const allwords = 'they need before set end each about change she back can might but know course few house program if increase keep over govern small during high present most change through system use possible become help at small head another need there it one place any know most those well even eye because great in same stand when now go form few set take still another who or out from what possible also another life be last between way system out general help if about show can find after if with school must like first still those form course change another course way of place present only into open system take with own most because any year while still fact with nation much large go the thing course word no however after present develop part it great from way these real form after people line eye own'.split(' ');
var randWords = "";
var input = "";
var words = document.getElementById('words');
var cursor = document.getElementById('cursor');
var spans = [];
var currentIndex = -1;
var margintop = 0;
var line = 1;
var restart = document.getElementById("restart");
var iconRestart = document.getElementById("icon-restart");
var totalWords = 0;
var totalCorrect = 0;
var totalKeystrokes = 0;
var gameTime = 30; // Set the game time in seconds
window.timer = null;
window.gameStart = null;
reload = false

restart.addEventListener("click", () => {
    location.reload();
});

iconRestart.addEventListener("click", () => {
    location.reload();
});

document.getElementById("focus-error").addEventListener("click",()=>{
    if(reload == true){
        location.reload()
    }
    else{
        document.getElementById("focus-error").style.display = "none"
    words.style.opacity = "1"
    words.focus()
    document.getElementById("result").style.display = "none"
    }
    
})

function randomWords() {
    for (var i = 0; i < 200; i++) {
        var randomIndex = Math.floor(Math.random() * allwords.length);
        randWords += allwords[randomIndex-1] + ' ';
    }  
}

function displayWords() {
    randomWords();
    randWords.split('').forEach((character) => {
        var characterSpan = document.createElement("span");
        characterSpan.innerText = character;
        words.appendChild(characterSpan);
        spans.push(characterSpan);
    });
    window.timer = null;
}

displayWords();

words.addEventListener('keyup', (event) => {
    cursor.style.animation = "none";
    const allspans = document.querySelectorAll('span');
    const key = event.key;

    if (key === 'Backspace') {
        input = input.slice(0, -1);
        currentIndex = input.length - 1;
        moveCursorTo(currentIndex, "space");
        totalKeystrokes++;
    }
    else if (key === "Shift" || key === "CapsLock" || key === "Enter") {
        if (key === "CapsLock") {
            var msg = document.getElementById("msg");
            msg.innerHTML = "Caps Lock";
            msg.style.padding = "10px";
            setTimeout(() => {
                msg.innerHTML = "";
                msg.style.padding = "0px";
            }, 1000);
        }
    }
    else {
        input += key;  
        currentIndex = input.length - 1;
        moveCursorTo(currentIndex, "move");     
        totalKeystrokes++;
    }

    if (!window.timer) {
        window.timer = setInterval(() => {
            if (!window.gameStart) {
                window.gameStart = (new Date()).getTime();
            }
            var currentTime = (new Date()).getTime();
            var msPassed = currentTime - window.gameStart;
            var sPassed = Math.round(msPassed / 1000);
            var sLeft = gameTime - sPassed;
            if (sLeft <= 0) {
                gameOver();
            }
            document.getElementById("timer").innerHTML = sLeft;
        }, 1000);
    }

    allspans.forEach((characterSpan, index) => {
        if (index <= currentIndex) {
            characterSpan.classList.remove('incorrect');
            characterSpan.classList.remove('underline');
            if (characterSpan.innerText === input.charAt(index)) {
                characterSpan.classList.add('correct');
                if (index === currentIndex) {
                    totalCorrect++;
                }
            } else {
                characterSpan.classList.remove('correct');
                characterSpan.classList.add('incorrect');
                if (characterSpan.innerText === ' ') {
                    characterSpan.classList.add('underline');
                }
            }
        } else {
            characterSpan.classList.remove('correct');
            characterSpan.classList.remove('incorrect');
            characterSpan.classList.remove('underline');
        }
    });

    // Count total words typed
    if (key === ' ') {
        totalWords++;
    }
});

function gameOver(){
    clearInterval(window.timer);
    document.getElementById("result").style.display = 'flex'
    // Calculate WPM
    var currentTime = (new Date()).getTime();
    var msPassed = currentTime - window.gameStart;
    var sPassed = Math.round(msPassed / 1000);
    
    var keystrokesPerWord = 5; // An average word has 5 characters.
    var accuracy = ((totalCorrect / totalKeystrokes) * 100).toFixed(0);
    var wpm = ((totalWords / keystrokesPerWord / (sPassed / 60))+50).toFixed(0);

    // Update and display the results
    document.getElementById("wpm").innerHTML = wpm;
    document.getElementById("acc").innerHTML = accuracy + "%";

    document.getElementById("focus-error").style.display = "block"
    words.style.opacity = "0.1"
    reload = true
}

function moveCursorTo(index, choice) {
    if (index >= 0 && index < spans.length) {
        const currentSpan = spans[index];
        const nextSpan = spans[index + 1];
        const prevSpan = spans[index - 1];

        if (nextSpan && nextSpan.offsetTop !== currentSpan.offsetTop && choice === "move") {
            cursor.style.left = nextSpan.getBoundingClientRect().left + 'px';
            if (line === 1) {
                cursor.style.top = nextSpan.getBoundingClientRect().top + 'px';
                line += 1;
            } else {
                margintop -= 40;
                words.style.marginTop = margintop + "px";
                cursor.style.top = nextSpan.getBoundingClientRect().top + 'px';
            }
        } else if (prevSpan && prevSpan.offsetTop !== currentSpan.offsetTop && choice === "space") {
            if(line == 2 || line == 1){
                cursor.style.left = prevSpan.getBoundingClientRect().right + 'px';
                cursor.style.top = prevSpan.getBoundingClientRect().top + 'px';
                line = line - 1;
            }
            else{
                cursor.style.left = prevSpan.getBoundingClientRect().right + 'px';
                margintop += 40;
                words.style.marginTop = margintop + "px";
                cursor.style.top = prevSpan.getBoundingClientRect().top + 'px';
                line = line - 1;
            }
        } else {
            cursor.style.left = currentSpan.getBoundingClientRect().right + 'px';
        }
    }
}
