const editor = document.getElementById("editor-container");
const toggleEditor = () => editor.classList.toggle("modal-oppened");

document.querySelectorAll(".level").forEach(card => {
    console.log(card)
    card.onmousemove = e => {
        const { currentTarget: target } = e;
        const rect = target.getBoundingClientRect();
        target.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        target.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    }
})