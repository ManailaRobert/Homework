var viewBTN = document.getElementsByClassName("view")[0]
viewBTN.addEventListener("click",viewNote)

var createBTN = document.getElementsByClassName("create")[0]
createBTN.addEventListener("click", createNote)

var updateBTN = document.getElementsByClassName("update")[0]
updateBTN.addEventListener("click", updateNote)

var deleteBTN = document.getElementsByClassName("delete")[0]
deleteBTN.addEventListener("click", deleteNote)

var pforNotes = document.getElementsByTagName("p")
var selectedElementId
//clicked note
for (let el of pforNotes){
el.addEventListener("click", getId)
}

var noteTitle = document.getElementsByTagName("input")[0]
var noteContent = document.getElementsByClassName("noteTextArea")[0]
var messageLabel = document.getElementById("messageLabel")

function getId()
{
selectedElementId = event.target.id
var selectedElement = document.getElementById(selectedElementId)
console.log(selectedElementId)
for (let el of pforNotes){
  el.classList.remove("clicked")
  }
selectedElement.classList.add("clicked")
}

 function viewNote()
 {
  //get the content and title through the id
  // display 
 }

 function createNote(){
  //send the title and content to backEnd
  //receive id
  //create note with id and title
 }

 function updateNote(){
  //send the id,content,title to BE
  //get a successfull msg that the update is successfull
  //change the content of message label and also its color with messageLabelError / messageLabelSuccess
 }

 function deleteNote(){
  //send the id to BE
  //get a response if successfull
  //change the content of message label and also its color with messageLabelError / messageLabelSuccess
 }

 function loadNotes(){
  //send a request to get all notes with their details
  //add all the notes to the interface
 }
 loadNotes()