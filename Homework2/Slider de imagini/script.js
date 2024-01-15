var selectedIndex = 1;
var img = document.getElementsByTagName("img")[0];
var Next = document.getElementsByClassName("next")[0]
var Prev = document.getElementsByClassName("prev")[0]
Next.addEventListener("click", next)
Prev.addEventListener("click",prev)
setInterval(next,5000)

var images = {
    1: "./Assets/1.png",
    2: "./Assets/2.png",
    3: "./Assets/3.png",
    4: "./Assets/4.png",
    5: "./Assets/5.png"
};

function next(){
    let radioButton = document.getElementById(selectedIndex.toString())
    radioButton.checked= false
    selectedIndex++;

    if(selectedIndex >5)
        selectedIndex = 1;
    radioButton = document.getElementById(selectedIndex.toString())
    img.src = images[selectedIndex]
    radioButton.checked= true
}

function prev(){
    let radioButton = document.getElementById(selectedIndex.toString())
    radioButton.checked= false
    selectedIndex--;
    if(selectedIndex <1)
            selectedIndex = 5;
    radioButton = document.getElementById(selectedIndex)
    img.src=images[selectedIndex]
    radioButton.checked= true
    }