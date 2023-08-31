let keyStates = {};
window.onkeydown = (event) => {

    keyStates[event.code] = true;
}

window.onkeyup = (event) => {
    keyStates[event.code] = false;
}
