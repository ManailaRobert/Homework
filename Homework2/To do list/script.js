var tasks = document.getElementsByClassName("tasks")[0]
var input = document.getElementsByTagName("textarea")[0]
var AddButton = document.getElementsByClassName ("Add-Button")[0]
var Save = document.getElementsByClassName("save")[0]
var nrTasks
var MaxID = 0
AddButton.addEventListener("click", addTask)
document.addEventListener("DOMContentLoaded", loadNotes)
//Save.addEventListener("click",save)

function createTask(text,id,checkedValue)
{
  
  let task  = document.createElement("div")
  task.classList.add("note")
  //create text
  let Text = document.createElement("p")
  Text.id = id
  Text.classList.add("text")
  Text.innerHTML = text
  //add text to task
  task.appendChild(Text)

  //create span1
  let span1 = document.createElement("span")

  //create buttons Edit/Delete
  //Edit
  let Edit = document.createElement("button")
  Edit.classList.add("Edit")
  Edit.id = id
  Edit.innerHTML ="Edit"
  Edit.addEventListener("click", editTask)
  //Delete
  let Delete = document.createElement("button")
  Delete.classList.add("Delete")
  Delete.innerHTML = "Delete"
  Delete.id = id
  Delete.addEventListener("click", deleteTask)

  // Done span
  let Done = document.createElement("input")
  Done.type = "checkbox"
  Done.classList.add(id)
  Done.addEventListener("change",save)
  Done.checked = checkedValue

   //add children to span
  span1.appendChild(Edit)
  span1.appendChild(Delete)
  
  //add span/done to task
  task.appendChild(span1)
  task.appendChild(Done)
  return task
}

function addTask()
{// create task function
    let text = input.value
    MaxID++; // to not have duplicates
    //create tasks
    let note = createTask(text,MaxID, false) 
    //add tasks
    tasks.appendChild(note)
    nrTasks++;// number of active tasks
    console.log("Creation Successful")
    save()
}
function editTask()
{  //get id of the caller - coresponds to the id of the text
  let id = event.target.id
  let pElement = document.getElementById(id)
  let text = pElement.innerText

  //create an input type element with the text value in it
  let inputElement = document.createElement("textarea")
  inputElement.id = id
  inputElement.value = text
  inputElement.addEventListener('blur',stopEdit) // for defocuse to stop the edit

  //parent element of  the paragraph element with specified id
  let note = pElement.parentElement

  //replace the paragraphElement with inputElement
  note.replaceChild(inputElement, pElement)

  // to focuse the input element
  inputElement.focus()
}

function deleteTask()
{
  //localStorage.clear()
  //parent of the button
let span = event.target.parentNode
//parent of the span-> parent of button that was clicked
let note = span.parentNode
//remove that child from all tasks
localStorage.removeItem(event.target.id)
tasks.removeChild(note)
nrTasks--;
console.log("Delete succesful")
save()
}



function stopEdit()
{
  //get id of the caller - coresponds to the id of the text
   let id =event.target.id
   let inputElement = document.getElementById(id)
   let text = inputElement.value

     //create an paragraph type element with the text as its value
   let pElement = document.createElement("p")
   pElement.id = id 
   pElement.classList.add ("text")
   pElement.innerHTML = text

  //parent element of  the input element with specified id
   let task = inputElement.parentElement

   //replace the inputElement with paragrahElement
   task.replaceChild(pElement, inputElement)
   save()
}

function save(){

  let allTasks = document.getElementsByClassName("text")
  localStorage.setItem("Number of Tasks", allTasks.length) // save number of active tasks
  for (let el of allTasks)
    {
      let id =el.id
      let text = el.innerText
      let input = document.getElementsByClassName(id)[0]
      let value 
      //check if a note is done
      if(input.checked == true)
        value = text +";true"
      else
        value = text+ ";false"
      localStorage.setItem("MaxID",id) // save max id
      localStorage.setItem(id,value)
    }
  console.log("Save succesfull")
}

function loadNotes(){
 nrTasks = localStorage.getItem("Number of Tasks");
  MaxID = localStorage.getItem("MaxID")
  console.log(nrTasks);
  if (nrTasks > 0) {
    let counter = 0
    let i = 0;
    while (counter < nrTasks) {
      
      let string = localStorage.getItem(i.toString());
      if(localStorage.getItem(i.toString()) !== null){
        let splitString = string.split(';')
        let text = splitString[0]
        let checkedValue = splitString[1]
        let note
        if(checkedValue === "true")
          note = createTask(text,i,true);
        else
          note = createTask(text,i,false);
        tasks.appendChild(note);
        counter++;
      }
      i++;
    }
    console.log("Load Successful");
  } else {
    console.log("No tasks to load.");
  }
}