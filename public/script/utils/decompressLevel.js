export default function decompressLevel(compressedLevel) {
    let intermediate = compressedLevel.split(/[a-z]/i)
    intermediate.forEach((elem, i) => intermediate[i] = elem.split(";"));
    let decompressedLevel = {
        spawn: {x: parseInt(intermediate[0][0].split(',')[0]), y: parseInt(intermediate[0][0].split(',')[1])},
        end: {x: parseInt(intermediate[0][1].split(',')[0]), y: parseInt(intermediate[0][1].split(',')[1])},
        bg: [],
        fg: []
    }
    intermediate[1].forEach(bg => {
        bg = bg.split(',');
        if (!bg[0] || !bg[1] || !bg[2]) return;
        decompressedLevel.bg.push({
            x: parseInt(bg[0]),
            y: parseInt(bg[1]),
            t: parseInt(bg[2])
        })
    })
    intermediate[2].forEach(fg => {
        fg = fg.split(',');
        if (!fg[0] || !fg[1] || !fg[2]) return;
        decompressedLevel.fg.push({
            x: parseInt(fg[0]),
            y: parseInt(fg[1]),
            t: parseInt(fg[2])
        })
    })
    return decompressedLevel;
}