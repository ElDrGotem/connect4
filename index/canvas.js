const w = 100;
var objects=[];
function setup(){
    createCanvas(1000,1000);
}
function draw(){
    background("#FFFFFF")
    objects.forEach(obj=>{
        fill(obj.col)
        rect(obj.x*w,obj.y*w,w,w)
    })
    fill("#000000")
    textSize(50)
    text(`${varTxt}\n${staticTxt}`,0,7*w)
}
function mouseClicked(){
    socket.emit("column in",{xp:Math.floor(mouseX/w),team:team})
}
