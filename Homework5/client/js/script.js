document.addEventListener("DOMContentLoaded", loadNotes)

var createBTN = document.getElementsByClassName("create")[0]
createBTN.addEventListener("click", createNote)

var pforNotes = document.getElementsByTagName("p")
var selectedElementId = 0

var notes = document.getElementsByClassName("notes")[0]

var noteTitle = document.getElementsByTagName("input")[0]
var noteContent = document.getElementsByClassName("noteTextArea")[0]
var messageLabel = document.getElementsByClassName("messageLabel")[0]
console.log(messageLabel)

//load all notes from DB
function loadNotes(){
  //send a request to get all notes with their details
  const URL = "http://localhost:5000/api/notes"
  const request = new XMLHttpRequest()
  request.open("GET",URL)
  request.setRequestHeader("Access-Control-Allow-Origin", "true");
  request.setRequestHeader("Content-Type", "application/json");
  request.onload = showNotes
  request.onerror = showError
  request.send()
  //add all the notes to the interface

  function showNotes()
  {
    const response = JSON.parse(request.response)
    if(request.status == 200)
      for (const key in response)
        displayNote(response[key].id, response[key].title)
  }

  function showError()
  {
    const response = JSON.parse(request.response)
    if(request.status == 500 || request.status ==400)
    showErrorMessage(response.message)
  }
 }

//view selected note
 function viewNote()
 {
  //create url
  let URL = `http://localhost:5000/api/note/${selectedElementId}`
  //create request
  let request = new XMLHttpRequest()
  //open connection to api
  request.open("GET", URL)
  //costomise request
  request.setRequestHeader("Access-Control-Allow-Origin", "true");
  request.setRequestHeader("Content-Type", "application/json");
  request.onload = displaySelectedNote
  request.onerror = showError
  request.send()

  function displaySelectedNote(){
    let response = JSON.parse(request.response)
    if(request.status == 200)
    {
      noteTitle.value = response.title
      noteContent.value = response.content
    }else if(request.status == 500)
    {
      showErrorMessage("You have not selected any note.")
    }
  }
  function showError()
  {
    let response = JSON.parse(request.response)
    console.log(response.message)
  }
 }
//create note
 function createNote(){
  let title = noteTitle.value
  let content = noteContent.value
  let data = {
    "title": title,
    "content": content
  }

  let jsonData =JSON.stringify(data)
  const request = new XMLHttpRequest()

  const URL = "http://localhost:5000/api/createNote"

  request.open("POST", URL)

  request.setRequestHeader("Access-Control-Allow-Origin", "true")
  request.setRequestHeader("Content-Type","application/json")

  request.onload = onLoad
  request.onerror = onError
  request.send(jsonData)

  function onLoad()
  {
    let response = JSON.parse(request.response)
    if (request.status == 200)
    {
      let title = response.title
      let id = response.id
      displayNote(id,title)
      if(selectedElementId === 0)
      createActionButtons()
      selectedElementId = id
      showClickElement()
      messageLabel.textContent = "Creation Successful"
      try{
        messageLabel.classList.remove("messageLabelSuccess")
      }catch{}
      messageLabel.classList.add("messageLabelSuccess")
    }
    else{
      showErrorMessage(response.message)
    }
  }

  function onError()
  {
    let response = JSON.parse(request.response)
    console.log(response)
    showErrorMessage(response.message)
  }

 }
//update note
 function updateNote(){

  //send the id,content,title to BE
  //get a successfull msg that the update is successfull
  //change the content of message label and also its color with messageLabelError / messageLabelSuccess

  var title = noteTitle.value
  var content = noteContent.value

  var data ={
  "title": title,
  "content":content
  }

  var jsonData = JSON.stringify(data)
  let URL = `http://localhost:5000/api/updateNote/${selectedElementId}`
  console.log(URL)
  const request = new XMLHttpRequest ()
  request.open("PUT",URL)
  request.setRequestHeader("Access-Control-Allow-Origin", "true");
  request.setRequestHeader("Content-Type", "application/json");
  request.onload = requestSuccess
  request.onerror = requestError
  request.send(jsonData)
  
  function requestSuccess(){
    var response = JSON.parse(request.response)
    if(request.status == 200)
    {
      showSuccessMessage(response.message)
      var titleLabel = document.getElementById(selectedElementId)
      titleLabel.innerHTML = title
    }
    else
      showErrorMessage(response.message)
  }

  function requestError(){
    var response = JSON.parse(request.response) 
    showErrorMessage(response.message) 
  }
 }
//delete note
 function deleteNote(){
  //send the id to BE
  //get a response if successfull
  //change the content of message label and also its color with messageLabelError / messageLabelSuccess
  let URL = `http://localhost:5000/api/deleteNote/${selectedElementId}`
  const request = new XMLHttpRequest()
  request.open("DELETE", URL)
  request.setRequestHeader("Access-Control-Allow-Origin", "true");
  request.setRequestHeader("Content-Type", "application/json");
  request.onload = requestSuccess
  request.onerror = requestError
  request.send()

  function requestSuccess()
  {
    var response = request.response
    if(request.status == 200){
      showSuccessMessage(response.message)
    }else 
      showErrorMessage("No selected note to delete")
  }

  function requestError()
  {
    var response = request.response
    if(request.status == 500)
      console.log(response.message)
  }
}

//displays note in notes
 function displayNote(id,title){
  let p = document.createElement("p")
  p.innerText = title
  p.id = id
  p.addEventListener("click", clicked)
  notes.appendChild(p)
}
// note click event
function clicked()
{
  if(selectedElementId === 0)
    createActionButtons()
  selectedElementId = event.target.id
  showClickElement()
  viewNote()
}
//shows note click
 function showClickElement()
{
  var selectedElement = document.getElementById(selectedElementId)
  console.log(selectedElementId)
  for (let el of pforNotes){
    el.classList.remove("clicked")
  }
selectedElement.classList.add("clicked")
}
// shows error message
 function showErrorMessage(message)
 {
  messageLabel.textContent = message
  try {messageLabel.classList.remove("messageLabelSuccess")}  
  catch (error) {}
  messageLabel.classList.add("messageLabelError")
 }
//shows success message
 function showSuccessMessage(message)
 {
  messageLabel.textContent = message
  try{
    messageLabel.classList.remove("messageLabelSuccess")
  }catch{}
  messageLabel.classList.add("messageLabelSuccess")
 }

 function createActionButtons()
 {
  var buttonsContainer = document.getElementsByClassName("buttonsContainer")[0]
  var updateBTN = document.createElement("button")
  var deleteBTN = document.createElement("button")

  updateBTN.innerHTML = "Update"
  deleteBTN.innerHTML = "Delete"
  updateBTN.addEventListener("click", updateNote)
  deleteBTN.addEventListener("click", deleteNote)
  buttonsContainer.appendChild(updateBTN)
  buttonsContainer.appendChild(deleteBTN)
 }