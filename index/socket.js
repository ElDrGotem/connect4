var socket = new io();
var team = prompt("Enter team (value from 1-3)")
socket.on("new draw",(content)=>{objects=content})
socket.on("new txt",(content)=>{varTxt=content})
socket.on("server request team",()=>{socket.emit("client team send",team)})
var varTxt = ""
var staticTxt = `Team ${team}`
