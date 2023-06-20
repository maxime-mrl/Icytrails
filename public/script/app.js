/* ---------------------------------- MODAL --------------------------------- */
function closeModal(modal) {
    if (!modal) return;
    if (!/modal/.test(modal.className)) return;
    modal.className = "modal";
}

function openModal(target) {
    const modal = document.getElementById(target);
    if (!modal) return;
    if (!/modal/.test(modal.className)) return;
    modal.className = "modal active";
}
const navbar = document.querySelector(".navbar")
function toggleNavbar() {
    navbar.classList.toggle("active")
}

/* ---------------------------- INPUT VALIDATION ---------------------------- */
const inputs = document.querySelectorAll('input:not([type="submit"], [type="range"], [type="select"])');
inputs.forEach(input => { // browse all input and initialize checking on blur
    let regex = input.getAttribute("data-check");
    if (/^\/.*\//.test(regex)) regex = eval(regex); // check if regex is valid
    else if (!/^=[a-z]+:/.test(regex)) return;
    let err = input.getAttribute("data-err");
    if (!err) err = "Invalid input!";
    const originalPlaceholder = input.getAttribute("placeholder");
    input.onblur = () => checkInput({ input, regex, err, originalPlaceholder })
})

function checkInput(elem) { // check input to visually tell the user if his input is good
    // assume success
    elem.input.setAttribute("data-state", "success");
    elem.input.setAttribute("placeHolder", elem.originalPlaceholder);
    if (/^=[a-z]+:/.test(elem.regex)) { // check for special rule (eg must match id)
        if (/^=id:/.test(elem.regex)) {
            const match = document.getElementById(elem.regex.split("=id:")[1])
            if (!match.value) fail();
            else if (match.value != elem.input.value) fail();
        } else fail();
    } else if (!elem.regex.test(elem.input.value)) fail();
    function fail() {
        elem.input.setAttribute("data-state", "fail");
        elem.input.value = "";
        elem.input.setAttribute("placeHolder", elem.err);
    }
}



/* -------------------------------------------------------------------------- */
/*                                    HOME                                    */
/* -------------------------------------------------------------------------- */
const keysimg = document.querySelectorAll("img.keys");
if (keysimg[0]) { // kind of basic caroussel to show each keys layout
    let i = 0;
    setInterval(() => {
        keysimg[i].className = "keys";
        i++;
        if (i >= keysimg.length) i = 0;
        keysimg[i].className = "keys active";
    }, 850)
}

/* -------------------------------------------------------------------------- */
/*                                level editor                                */
/* -------------------------------------------------------------------------- */
const editor = document.getElementById("editor-container");
const toggleEditor = () => editor.classList.toggle("modal-oppened");

// resize editor blockList to match document height
const blocksEditor = document.querySelector(".blocks-select");
if (blocksEditor) {
    blocksEditor.style.minHeight = Math.max(document.body.offsetHeight, window.innerHeight) + "px";
    window.onresize = () => blocksEditor.style.minHeight = Math.max(document.body.offsetHeight, window.innerHeight) + "px";
}

/* -------------------------------------------------------------------------- */
/*                               Level browser                                */
/* -------------------------------------------------------------------------- */
document.querySelectorAll(".level").forEach(card => card.onmousemove = e => { // cool mouse hover effect for each level
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    target.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    target.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
})


/* -------------------------------------------------------------------------- */
/*                               Word scrambler                               */
/* -------------------------------------------------------------------------- */
class WorldScrambler { // typing effect to change world
    constructor (text) {
        this.text = text;
        this.words = [];
        text.getAttribute("data-words").split(';').forEach(word => this.words.push(word.split("%c")));
        this.actualWord = 0;
        this.duration = {
            show: 1500,
            hide: 200,
            update: 80
        };
        this.nextWord();
    }
    trimWord() { // remove the letter
        this.text.innerHTML = this.text.innerHTML.slice(0,-1);
        if (this.text.innerHTML == "") {
            this.text.innerHTML = " ";
            return setTimeout(this.newWord, this.duration.hide);
        };
    
        setTimeout(() => this.trimWord(), this.duration.update);
    }
    newWord = (i=0) => { // add the new word
        const word = this.words[this.actualWord];
        this.text.style.color = word[1];
        if (!word[0][i]) return this.nextWord(); // if no letters left to add start over
        this.text.innerHTML += word[0][i];
        setTimeout(() => this.newWord(i+1), this.duration.update);
    }
    
    nextWord = () => setTimeout(() => { // wait a bit and start over w/nex word
        this.actualWord++;
        if (this.actualWord >= this.words.length) this.actualWord = 0;
        this.trimWord();
    }, this.duration.show);
}
const scramblers = document.querySelectorAll(".scramble");
if (scramblers) scramblers.forEach(elem => new WorldScrambler(elem));
