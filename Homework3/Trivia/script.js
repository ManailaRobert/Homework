var response = document.getElementsByClassName("response")
var input = document.getElementsByTagName("input") // checkbox elements
//1 answer feature
//event adder
for(let el of input)
    el.addEventListener('change',checkChange)
    
//selected checkbox stays on and the rest get unchecked  
function checkChange(){
    for(let element of input)
    if(element.id !== event.target.id)   
    element.checked = false
    else  element.checked = true
}
//how the game works
var question = document.getElementById("question")
var submit = document.getElementsByClassName("submit")[0]
var questions=createQuestions()
var questionNumber = 1;
var questionAnswer
var corectQuestions = 0;
var numberOfQuestions
document.addEventListener('DOMContentLoaded',initializeQuestion)
submit.addEventListener("click", answer)
//question creater
function createQuestions(){
    let questions={
        "1":{
            "Q":"Whats is the largest animal on planet?",
            "1": "Giraffe",
            "2": "Antarctic Blue Whale",
            "3": "Elephant",
            "4": "Hippopotamus",
            "A": "2"
        },

        "2":{
            "Q":"Which animal is the fastest on land?",
            "1": "Sloth",
            "2": "Ghepard",
            "3": "Lion",
            "4": "Cheetah",
            "A": "4"
        },
        "3":{
            "Q":"What does the bat use to navigate and locate its prey?",
            "1": "Viewlocation",
            "2": "Dislocation",
            "3": "Echolocation",
            "4": "Reallocation",
            "A": "3"
        },
        "4":{
            "Q":"What do you call animals that eat everything (meat, plants and fish)?",
            "1": "Omnivores",
            "2": "Carnivores",
            "3": "Herbivores",
            "4": "Frugivores",
            "A": "1"
        }
    };
    return questions
}
//start game function
function initializeQuestion(){
    numberOfQuestions = Object.keys(questions).length
    question.innerHTML = questions[questionNumber]["Q"]
    questionAnswer = questions[questionNumber]["A"]
    for(let i=0;i<4;i++)
        response[i].innerHTML = questions[questionNumber][i+1]
}
// answer event
function answer(){
    let Answer =document.getElementById(questionAnswer)//the checkbox with the corect answer
    //corect answer
    if(Answer.checked == true)
        corectQuestions++;

    //uncheck all answers
    for(let el of input)
        el.checked = false
    questionNumber++;//next question
    if(questionNumber>numberOfQuestions) // max number of questions
    {
        let answers = document.getElementsByClassName("answers")[0]
        let parent = answers.parentNode
        parent.removeChild(answers)
        parent.removeChild(question)

        let finalMessage = document.createElement("h3")
        finalMessage.innerHTML = `You answered ${corectQuestions} out of 4 questions right.`
        let container = document.getElementsByClassName("container")[0]
        container.appendChild(finalMessage)
    
    }else initializeQuestion()
}
