var audio =document.getElementsByTagName('audio')[0]
var buttons = document.getElementsByClassName("button")
var start = document.getElementsByClassName("start")[0]
var score = document.getElementsByClassName("score")[0]
var steps  = [getRandomInt(0,4)]
var playerStep
var step 
var level 
audio.volume = 0.15;// audio volume
//audios
var audios = {
    0:"Assets/0.mp3",
    1:"Assets/1.mp3",
    2:"Assets/2.mp3",
    3:"Assets/3.mp3"
}
//add event for starting the game button
start.addEventListener("click",buttonStartClick)

// function for random number 
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
//add events for play buttons
function addEventsForPlayButtons()
{
    for(let el of buttons)
    el.addEventListener("click", playButtonsClick)
}
//button start click
function buttonStartClick(){
    start.innerHTML = "Start Game"
    score.innerHTML="Score: 0"
    steps.length = 0
    addEventsForPlayButtons()
    level = 0
    step = 0
    initializeSteps()
    displaySequence()
}

//create the steps list
function initializeSteps()
{
    for(let i = 1;i<=50;i++)
    steps.push(getRandomInt(0,4))
    //debug: console.log(steps)
}
//displayes the sequence 
function displaySequence() {
    let i = 0;
    function displayStep() {
        if (i <= level) {
            let buttonId = steps[i];
            buttons[buttonId].classList.add(`active${buttonId}`);//lights the button in the sequence up
            //plays specific audio for button
            audio.src=audios[buttonId]
            audio.play()
            // darkens the button in the sequence
            setTimeout(function () {
                buttons[buttonId].classList.remove(`active${buttonId}`); 
                i++; //for iterating through steps
                    displayStep(); // recursivity for iterating through steps
            }, 500);
        }
    }
    displayStep(); // starts the iteration of displaying through steps
}

//playButtonsClick 
function playButtonsClick()
{
    //gets the id of the button that calls this event
    playerStep= event.target.id
    //plays the audio of that specific button
    audio.src=audios[playerStep]
    audio.play()
    //logic of the game
    verify()
}
function verify(){
    if(step <= level) // just for items that have been displayed
    {
        // debug :console.log(` playerStep:${playerStep} step ${step} steps[step]${steps[step]}`)
        //right or wrong answer
        if(playerStep == steps[step])
            { 
            console.log("Right") 
            step++   
            }
        else
            {
            console.log("Wrong")
            start.innerHTML = "Restart Game"

            //play buttons cant be used to play the game anymore
                for(let el of buttons)
                    el.removeEventListener("click", playButtonsClick)
            //score shows final score
                score.innerHTML = `Final score: ${level}`
            }
    }
    if(step>level){
        //level change = it advances in the displayed sounds/lights
        //debug: console.log("step>level")
        step = 0 
        level++
        //debug : console.log(`${level} ${step}`)
        score.innerHTML = `Curent score: ${level}` // changes the score 
        setTimeout(displaySequence, 700); // starts the display of the new sequence after some time
    }

}