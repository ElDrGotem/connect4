const express = require("express");
const socket = require("socket.io");
const http = require("http");
const port = 3000;
var app = express();
var test1 = http.createServer(app);
var server = test1.listen(port,"0.0.0.0",function(){
    console.log(`listening on port ${port}`)
});
var io = socket(server);
var connections = {};
app.use(express.static('index'));

io.on("connection",socket=>{
    connections[socket.id] = {id:socket.id};
    sendDraw()
    socket.emit("server request team")
    socket.on("disconnect",()=>{
        delete(connections[socket.id])
    })
    socket.on("column in",content=>{place(content.xp,content.team)})
    socket.on("client send team",(team)=>{connections[socket.id].team = team})
})

const WIDTH = 7;
const HEIGHT = 6;
const COLOURS = ['#FFFFFF','#FF0000','#00FF00','#0000FF'];
const DIRECTIONS = [{dx:1,dy:1},{dx:1,dy:0},{dx:1,dy:-1},{dx:0,dy:-1}];
var objects = [];
var currentTeam = [1,2,3];
class counter{
    constructor(x,y,team){
        this.x=x;
        this.y=y;
        this.upd(team);
    }
    upd(team){
        this.team=team
        this.col=COLOURS[team];
    }
}
function genGrid(){
    objects = []
    currentTeam = [1,2,3]
    for (x=0;x<WIDTH;x++){
        for (y=0;y<HEIGHT;y++){
            objects.push(new counter(x,y,0))
        }
    }
}
genGrid()

function place(colIn,team){
    if (team!=currentTeam[0]) return undefined;
    let col = objects.filter(obj=>{return obj.x==colIn}).reverse();
    let flag = false
    col.forEach(cell=>{
        if (!flag){
            if (cell.col=='#FFFFFF'){
                cell.upd(team);
                flag=cell;
            }
        }
    });
    currentTeam.push(currentTeam.shift())
    checkWin(flag);
}
function sendDraw(){
    let sendTxt = `Turn of Team ${currentTeam[0]}`
    io.emit("new txt",sendTxt)
    if (Object.keys(connections).length===0){genGrid()}
    io.emit("new draw",objects)
}
function checkWin(initCell){
    DIRECTIONS.forEach(dir=>{
        let originCell = getOrigin(initCell,dir)
        if(countingIsTheHardestPartOfMaths(originCell,dir,1)>=4) console.log(`Team ${currentTeam[0]} wins`);
    });
}
function returnNewCell(x,y){
    return objects.filter(obj=>{if ((obj.x==x)&&(obj.y==y)&&(obj.team==initCell.team)) return obj})
}
function getOrigin(initCell,dir){
    let newCell = returnNewCell(initCell.x+dir.dx,initCell.y+dir.dy);
    if (newCell.length>0) return getOrigin(newCell[0],dir);
    else return initCell;
}
function countingIsTheHardestPartOfMaths(initCell,dir,count){
    let newCell = returnNewCell(initCell.x-dir.dx,initCell.y-dir.dy);
    if (newCell.length>0) return countingIsTheHardestPartOfMaths(newCell[0],dir,count+1);
    else return count;
}

setInterval(sendDraw,1000/30);
