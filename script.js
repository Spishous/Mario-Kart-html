let devmod=false,
    firstInteract=false,
    mapName="map-1",
    info="",
    contextCanvas = "",
    mapMask = new Image(),
    toggleMusic=1,
    contextAudio = new AudioContext(),
    TimeStartGame=Date.now(),
    listKeyPressed=[];
    onPause=false;
    themeMusic = null

mapMask.onload = () => {
    let canvas = document.createElement('canvas');
    contextCanvas=canvas.getContext('2d')
    canvas.width=mapMask.width;
    canvas.height=mapMask.height;
    contextCanvas.drawImage(mapMask, 0, 0);

}

mapMask.src = './src/'+mapName+'-mask.png';
mapMask.src = 'data:image/png;base64,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kfw0hUIBeD+jb8oB/bdA96rbW3Mfpw9AhrpaugEODoHRImWvebw72N7bv2ea/f0AL2ByjBRjKpYAAA33aVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA0LjQuMC1FeGl2MiI+CiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiCiAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICB4bWxuczpHSU1QPSJodHRwOi8vd3d3LmdpbXAub3JnL3htcC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgeG1wTU06RG9jdW1lbnRJRD0iZ2ltcDpkb2NpZDpnaW1wOmE4YzI1ZjhjLTc3ZjctNGNhNC05MjQzLThiYjE0MGVkMDEyZSIKICAgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxZGJhMGEyMC0yOTYwLTRjOGYtODM3ZS0wMWZiOWM0NjhjNzkiCiAgIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5ZDFhMTIwZC1iNTUxLTRiZjQtYWRkYS03ZGRiYzY2MDdhZDgiCiAgIGRjOkZvcm1hdD0iaW1hZ2UvcG5nIgogICBHSU1QOkFQST0iMi4wIgogICBHSU1QOlBsYXRmb3JtPSJXaW5kb3dzIgogICBHSU1QOlRpbWVTdGFtcD0iMTY1NzM5MzgwMzUyMzE2MiIKICAgR0lNUDpWZXJzaW9uPSIyLjEwLjMwIgogICB0aWZmOk9yaWVudGF0aW9uPSIxIgogICB4bXA6Q3JlYXRvclRvb2w9IkdJTVAgMi4xMCI+CiAgIDx4bXBNTTpIaXN0b3J5PgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InNhdmVkIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvIgogICAgICBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmY1YjQ3ODVkLWU2Y2QtNDcwMC1hYzllLTk4NWJkNGY2MzE2NyIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iR2ltcCAyLjEwIChXaW5kb3dzKSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyMi0wNy0wOFQxMjo1NjoyMyIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJzYXZlZCIKICAgICAgc3RFdnQ6Y2hhbmdlZD0iLyIKICAgICAgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoxZWNlZjRjNC1jOTZjLTRiZTctOTc5Yy02MDM5OTBhNjgwMzgiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkdpbXAgMi4xMCAoV2luZG93cykiCiAgICAgIHN0RXZ0OndoZW49IjIwMjItMDctMDlUMjE6MTA6MDMiLz4KICAgIDwvcmRmOlNlcT4KICAgPC94bXBNTTpIaXN0b3J5PgogIDwvcmRmOkRlc2NyaXB0aW9uPgogPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAg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';
document.getElementsByTagName('map')[0].style.backgroundImage='url("./src/'+mapName+'c.png")'

function recommencer(){
    location=".";
}

function quitter(){
    location="main.html";
}

function pause(pause=onPause){
    onPause=pause;
    if(pause){
        TimeStartGame=Date.now()-TimeStartGame;
        document.body.classList.add('paused')
        player.pause();
        music.playSound("menu1",0.5)
    }else{
        if(document.body.classList.contains('paused')){
            TimeStartGame=Date.now()-TimeStartGame;
            document.body.classList.remove('paused')
            player.resume();
            music.playSound("menu2",0.5)
        }
    }
}

function loadSample(url) {
    return fetch(url)
        .then(response => response.arrayBuffer())
        .then(buffer => contextAudio.decodeAudioData(buffer));
}

function playSample(sample, rate=0.1) {
    const source = contextAudio.createBufferSource();
    source.buffer = sample;
    source.playbackRate.value = rate;
    source.loop=true;
    source.connect(contextAudio.destination);
    source.start(0);
    return source;
}

function setTime(){
    let now=Date.now()-TimeStartGame;
    let ms=now.toString().slice(-3);
    let sec=('0' + Math.floor(now/1000)%60).slice(-2);
    let min= Math.floor(now/60000);
    document.querySelector("#timer span").innerHTML=min+":"+sec+":"+ms
}
function updateKey(){
    player.pressTurn=0;
    player.pressAccelerate=0;
    if(listKeyPressed['Enter']) player.endRefresh();
    if(listKeyPressed['s']||listKeyPressed['ArrowDown']) player.pressAccelerate=-1;
    if(listKeyPressed['z']||listKeyPressed['ArrowUp']) player.pressAccelerate=1;
    if(listKeyPressed['q']||listKeyPressed['ArrowLeft']) player.pressTurn=1;
    if(listKeyPressed['d']||listKeyPressed['ArrowRight']) player.pressTurn=-1;
}
document.addEventListener('keydown',function(e){
    switch (e.key){
        case "w":
            localStorage.setItem("rotate",player.rotate.toString());
            localStorage.setItem("posx",player.posx.toString());
            localStorage.setItem("posy",player.posy.toString());
            break;
        case "a":
            player.statechange=0;
            break;
        case "d":
        case "ArrowRight":
            listKeyPressed["q"]=0;
            listKeyPressed["ArrowLeft"]=0;
            break;
        case "q":
        case "ArrowLeft":
            listKeyPressed["ArrowRight"]=0;
            listKeyPressed["d"]=0;
            break;
        case "z":
        case "ArrowUp":
            listKeyPressed["ArrowDown"]=0;
            listKeyPressed["s"]=0;
            break;
        case "s":
        case "ArrowDown":
            listKeyPressed["ArrowUp"]=0;
            listKeyPressed["z"]=0;
            break;
        case " ":
            if(!listKeyPressed[' ']){
                let kart=document.querySelector("kart");
                if(!player.onJump){
                    player.onJump=true;
                    player.drift=player.pressTurn;
                    kart.classList.remove("jump");
                    kart.clientHeight;
                    kart.classList.add("jump");
                    setTimeout(()=>{
                        player.onJump=false;
                        kart.classList.remove("jump");
                    },500)
                }
            }
            break;
        case "e":
            if(toggleMusic){
                toggleMusic=0;
                themeMusic=new Audio('./src/music-map1.ogg');
                //kartEngine.volume=.2
                //kartEngine.loop=true;
                themeMusic.play();
                //kartEngine.play();
                themeMusic.volume=0.05
            }else{
                toggleMusic=1
                themeMusic.pause();
            }
            break;
    }
    listKeyPressed[e.key]=1;
    updateKey();
})
document.addEventListener('keyup',function(e){
    if(e.key===" "){
        player.drift=0;
    }
    if(e.key==="Escape"){
        onPause=!onPause;
        pause(onPause);
    }
    listKeyPressed[e.key]=0;
    updateKey();
})
document.addEventListener('click',()=>{
    if(!firstInteract){
        firstInteract=true;
        if(devmod) music.playSound("start-race",0.2)
    }
})

setTimeout(()=>{
    document.body.classList.remove("load");
},2000)

class map{
    static mapName="map-1";
    static elMap=null;
    static mapLoaded=false;
    static loadMapObj(){
        map.elMap=document.querySelector("map");
        map.readJsonFile(map.mapName,(data)=>{
            map.createObj(data)
            map.mapLoaded=true;
        })
    }
    static createObj(dataJson){
        let elGame=document.getElementById("game"),
            mapW=-map.elMap.clientWidth/100,
            mapH=-map.elMap.clientHeight/100;
        for(let i=0,l=dataJson.length;i<l;i++){
            let newObj=document.createElement(dataJson[i].name);
            newObj.classList.add("objet");
            newObj.setAttribute("data-x",(dataJson[i].x-50)*mapW);
            newObj.setAttribute("data-y",(dataJson[i].y-50)*mapH);
            newObj.setAttribute("data-size",1);
            elGame.insertAdjacentElement("afterbegin",newObj);
        }
    }
    static readJsonFile(fileName, callback) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", "./src/"+fileName+".json", true);
        rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                callback(JSON.parse(rawFile.responseText));
            }
        }
        rawFile.send(null);
    }
    static removeAllObj(){
        document.querySelectorAll("coin").forEach(el=>{
            el.remove()
        })
        document.querySelectorAll("box").forEach(el=>{
            el.remove()
        })
    }
}
map.removeAllObj();
map.loadMapObj();
class music {
    static listPlayer={};
    static playSound(name, volume, rate = 1) {
        if(!music.listPlayer[name]){
            music.listPlayer[name]=new Audio('./src/' + name + '.ogg');
        }else{
            if(music.listPlayer[name].played){
                let audio = new Audio('./src/' + name + '.ogg');
                audio.playbackRate = rate;
                audio.volume = volume
                audio.play();
                return;
            }
        }
        music.listPlayer[name].playbackRate = rate;
        music.listPlayer[name].volume = volume
        music.listPlayer[name].play();
    }
}

class bloc{
    static isBloc(color){
        //return false;
        return color === "#f80000"// || color === "#00a800";
    }
    static DataToHex(data){
        return this.rgbToHex(data[0],data[1],data[2])
    }
    static rgbToHex(r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }
    static componentToHex(c) {
        let hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }
    static getFloor(posx,posy){
        let listType={
            "#f80000":"wall",
            "#00a800":"grass",
            "#000000":"road",
            "#d89820":"sand"
        }
        let pickx=Math.round((1000-(posx+500))*1.024),
            picky=Math.round((1000-(posy+500))*1.025),
            current=bloc.DataToHex(contextCanvas.getImageData(pickx,picky, 1, 1).data);
        return listType[current]??"unknow floor";
    }
    static evalBump(posx,posy,speed){
        if(contextCanvas){
            let pickx=Math.round((1000-(posx+500))*1.024),
                picky=Math.round((1000-(posy+500))*1.025),
                //{data} = contextCanvas.getImageData(pickx,picky, 1, 1),
                bumpx=0,
                bumpy=0;
            if(bloc.isBloc(bloc.DataToHex(contextCanvas.getImageData(pickx+speed,picky, 1, 1).data))) bumpx++;
            if(bloc.isBloc(bloc.DataToHex(contextCanvas.getImageData(pickx-speed,picky, 1, 1).data))) bumpx--;
            if(bloc.isBloc(bloc.DataToHex(contextCanvas.getImageData(pickx,picky+speed, 1, 1).data))) bumpy++;
            if(bloc.isBloc(bloc.DataToHex(contextCanvas.getImageData(pickx,picky-speed, 1, 1).data))) bumpy--;
            return {bumpX:bumpx,bumpY:bumpy};
        }
        return {bumpX:0,bumpY:0};
    }
}

class kart{
    dTime=Date.now();
    fixLag=1;
    floor="road";
    changeItem=false;
    engineSound=null;
    rotate=parseFloat(localStorage.getItem("rotate")??0);
    posx=parseFloat(localStorage.getItem("posx")??-398);
    posy=parseFloat(localStorage.getItem("posy")??-68);
    acceleration=0;
    vitesse=0;
    vMax=3;
    pressTurn=0;
    pressAccelerate=0;
    turnAnim=0;
    statechange=true;
    pieces=0;
    drift=false;
    smoke=0;
    onJump=false;
    map=document.querySelector('map');
    loopRefresh=null;
    constructor(){
        this.pause();
        this.resume();
        if(!firstInteract){
            firstInteract=true;
            music.playSound("start-race",0.2)
            setTimeout(()=>{
                toggleMusic=0;
                themeMusic=new Audio('./src/music-map1.ogg');
                themeMusic.loop=true;
                themeMusic.play();
                themeMusic.volume=0.1
            },3000)
        }
    }
    pause(){
        this.endRefresh();
    }
    resume(){
        this.loopRefresh=setInterval(() => {
            this.fixLag=(Date.now()-this.dTime)/25;
            this.dTime=Date.now();
            /*if(0 && !this.engineSound && firstInteract){
                this.engineSound=1
                loadSample('./src/engine3.ogg')
                    .then(sample => {
                        this.engineSound=playSample(sample)
                        this.engineSound.playbackRate.value = 2;
                    });
            }*/
            if(this.statechange || this.pressTurn || this.pressAccelerate){
                this.statechange=1;
                this.itemChangement()
                this.refresh();
                setTime();
                if(this.engineSound && this.engineSound!==1) this.engineSound.playbackRate.value=Math.abs(this.vitesse/5)+0.3;
                if(devmod) {
                    info="posx: "+this.posx+
                        "\nposy: "+this.posy+
                        "\nrotate: "+this.rotate+
                        "\nvitesse: "+this.vitesse+
                        "\npieces: "+this.pieces+
                        "\ndrift: "+this.drift+
                        "\nsol: "+this.floor+
                        "\nturn anim: "+this.turnAnim;
                    if(info!==document.getElementById("info").innerHTML) document.getElementById("info").innerHTML=info;
                }
                if(contextCanvas && this.vitesse){
                    let {bumpX,bumpY}=bloc.evalBump(this.posx,this.posy,this.vMax)
                    if(bumpX || bumpY){
                        if(Math.abs(this.acceleration)===this.vMax){
                            music.playSound("bump",0.4)
                        }
                        this.posx+=bumpX*Math.abs(this.acceleration);
                        this.posy+=bumpY*Math.abs(this.acceleration);
                        this.acceleration=this.acceleration/1.2;
                    }
                }
                this.setObject();
            }
        },20);
    }
    itemChangement(){
        if(this.changeItem) document.getElementsByTagName("item")[0].style.backgroundPositionX="-"+Math.floor(Math.random()*8.99)+"em";
    }
    interactObject(objet,that){
        switch (objet.tagName){
            case "COIN":
                that.pieces++;
                music.playSound("coin",0.5)
                break;
            case "BOX":
                if(!that.changeItem){
                    that.changeItem=true;
                    music.playSound("item-box2",0.15)
                    setTimeout(()=>{
                        that.changeItem=false;
                        let item=document.getElementsByTagName("item")[0];
                        item.classList.remove("strobe")
                        item.clientHeight;
                        item.classList.add("strobe")
                    },4000)
                }
                break;
        }
        objet.remove();
    }
    setObject(){
        let that=this;
        let posxCam=that.posx-(Math.sin((that.rotate/180)*Math.PI) * 50)
        let posyCam=that.posy-(Math.cos((that.rotate/180)*Math.PI) * 50)
        let ratio=1000/document.body.clientWidth;
        let rotate=that.rotate%360;
        if(rotate<0) rotate+=360;
        document.querySelectorAll(".objet").forEach(function(objet) {
            let x=parseInt(objet.dataset.x);
            let y=parseInt(objet.dataset.y);
            let distance=kart.Distance(that.posx,that.posy,x,y);
            if(distance<8){
                that.interactObject(objet,that)
            }else{
                let angle=kart.Angle(that.posx,that.posy,x,y);
                let angleCam=kart.Angle(posxCam,posyCam,x,y);
                let distanceCam=kart.Distance(posxCam,posyCam,x,y);
                let direction=kart.diffAngle(angle,rotate)
                let directionCam=kart.diffAngle(angleCam,rotate)
                let backAng=1-(Math.abs(direction)/90);
                let backAng2=(directionCam/90);
                if(Math.abs(direction)>90 && objet.style.zIndex!=="4"){
                    objet.style.zIndex="4";
                }else{
                    if(Math.abs(direction)<90 && objet.style.zIndex!=="2"){
                        objet.style.zIndex="2";
                    }
                }
                let bottom=600 - (19200 / ((distance*backAng) +57));
                bottom+=(Math.abs(backAng2*1.4)*(600-bottom))*(backAng);
                if(distance*backAng<-40){
                    bottom=-600
                    if(parseInt(objet.style.bottom)===bottom){
                        return;
                    }
                }
                let left=((backAng2*distanceCam)*((600-bottom)/220))*(ratio*1.05);
                if(left>100 || left<-100) return;
                objet.setAttribute("ang",backAng2.toString())
                objet.setAttribute("dist",distance.toString())
                objet.style.bottom=bottom+"px";
                objet.style.left=(left+50)+"%";
                objet.style.transform="translate(-50%,50%) scale("+(600-bottom)/300+")";
            }
        });
    }
    refresh(){
        if(this.pressAccelerate){
            if(Math.abs(this.acceleration)!==this.vMax){
                this.acceleration+=(this.pressAccelerate*0.2-Math.sign(this.acceleration)*0.1);
                if(Math.abs(this.acceleration)>this.vMax) this.acceleration=this.vMax*Math.sign(this.acceleration);
            }
        }else{
            this.acceleration-=(Math.sign(this.acceleration)*0.1);
            if(Math.abs(this.acceleration)<0.09) this.acceleration=0;
        }
        this.setVector();
        if(!this.vitesse){this.drift=0;this.turnAnim=0;}
        if(this.drift && this.vitesse){
            this.turnAnim=3;
            this.turnAnim+=this.pressTurn*this.drift;
            this.turnAnim*=this.drift;
            this.rotate+=(this.drift*1.5+this.pressTurn*1.2)*this.fixLag;
        }else{
            if(this.turnAnim===4*this.pressTurn) this.turnAnim-=this.pressTurn;
            if(this.pressTurn){
                let r=Math.abs(this.vitesse/2);
                if(0 && devmod) this.rotate+=(this.pressTurn*2)*this.fixLag;
                else this.rotate+=(this.pressTurn*Math.log(r + 1)*2)*Math.sign(this.vitesse)*this.fixLag;//(Math.pow(Math.exp(1),-Math.pow(((r * 50 - 3) / 150),2))*Math.log(r + 1))*this.pressTurn*10;
                if(Math.abs(this.turnAnim+this.pressTurn)<3) this.turnAnim+=this.pressTurn;
            }else{
                this.turnAnim-=Math.sign(this.turnAnim);
            }
        }
        this.floor=bloc.getFloor(this.posx,this.posy)
        this.setAnim();
        let data="rotateZ("+this.rotate+"deg) translate("+this.posx+"em, "+this.posy+"em)"
        if(this.map.style.transform!==data) this.map.style.transform=data;
    }
    setAnim(){
        let kart=document.querySelector("kart");
        let player=kart.querySelector("player");
        let anim=1;
        let spriteY="-2em",spriteX="-4em";
        if(this.vitesse<0 && !player.classList.contains("reverse")){
            kart.classList.add("reverse")
        }else{
            if(kart.classList.contains("reverse")) kart.classList.remove("reverse");

            if(this.drift>0 || (!this.drift && this.turnAnim>0)) kart.classList.add("mirror");
            else kart.classList.remove("mirror");
            if(this.turnAnim) anim=1+Math.abs(this.turnAnim);
            spriteY="0em";spriteX="-"+anim+"em";
            if(!this.vitesse&&this.turnAnim) spriteY="-2em";
            player.style.backgroundPositionX="-"+anim+"em";
        }
        if(player.style.backgroundPositionY!==spriteY) player.style.backgroundPositionY=spriteY
        if(player.style.backgroundPositionX!==spriteX) player.style.backgroundPositionX=spriteX
        let vectX=-(this.drift*1.5+this.pressTurn*2)*this.pressAccelerate;
        let vectY=(this.acceleration)*this.fixLag;
        document.querySelectorAll("ul.smoke li").forEach(el=>{
            if(!el.classList.contains("fadeout")){
                el.classList.add("fadeout")
                setTimeout(()=>{
                    el.remove()
                },200)
            }
            el.style.left=(parseInt(el.style.left||0)+vectX)+"px";
            let t=(parseInt(el.style.top||0)+vectY*1.8)
            el.style.top=t+"px";
            el.style.transform="scale("+(t/50+1)+")";
            if(t<0) el.style.zIndex="-1";
        })
        if(!this.onJump){
            if(this.floor==="sand" && this.vitesse && this.smoke<=0){
                this.smoke=9;
                document.querySelector('ul.smoke').insertAdjacentHTML("afterbegin","<li></li>")
            }else{
                if(this.drift&& this.smoke<=0){
                    this.smoke=9;
                    document.querySelector('ul.smoke').insertAdjacentHTML("afterbegin","<li class='r'></li>")
                }
            }
        }

        this.smoke-=Math.abs(this.vitesse);
    }
    setVector(){
        this.vitesse=Math.min(this.acceleration,this.vMax);
        this.posx+=Math.sin(this.rotate*Math.PI/180)*(this.vitesse*this.fixLag);
        this.posy+=Math.cos(this.rotate*Math.PI/180)*(this.vitesse*this.fixLag);
    }
    endRefresh(){
        if(this.loopRefresh){
            clearInterval(this.loopRefresh);
        }

    }
    static Angle(x1,y1,x2,y2) {
        let angle=Math.atan2(x1-x2,y1-y2);
        angle*=180/Math.PI;
        if(angle<0)angle+=360;
        return angle;
    }
    static Distance(x1,y1,x2,y2){
        return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
    }
    static diffAngle(ang1,ang2){
        ang1=ang1%360;
        ang2=(ang2+180)%360;
        let diff=ang2-ang1;
        if(diff>180) diff-=360;
        if(diff<-180) diff+=360;
        return diff;
    }
}
let player=new kart();
