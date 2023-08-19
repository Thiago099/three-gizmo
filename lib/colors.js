export {getColor,setColor}

const colors = {
    "color1":0xff9999,
    "color2":0x99ff99,
    "color3":0x66ccff,
    "hover":0xffff99,
    "color4":0xC5B4E3,
}

function setColor(name, value)
{
    colors[name] = value
}
function getColor(name)
{
 
    return colors[name]
}
