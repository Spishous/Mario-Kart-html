let devmod=true,
    firstInteract=false,
    mapName="map-1",
    info="",
    contextCanvas = "",
    mapMask = new Image(),
    toggleMusic=-1,
    contextAudio = new AudioContext(),
    TimeStartGame=Date.now(),
    listKeyPressed=[],
    onPause=false,
    themeMusic=new Audio('./src/audio/music-map1.ogg');
    themeMusic.loop=true;
    themeMusic.volume=0.15
    mapMask.crossOrigin = "Anonymous";

mapMask.onload = () => {
    let canvas = document.createElement('canvas');
    contextCanvas=canvas.getContext('2d')
    canvas.width=mapMask.width;
    canvas.height=mapMask.height;
    contextCanvas.drawImage(mapMask, 0, 0);

}
mapMask.src = "./src/map-1-mask.png";
document.getElementsByTagName('map')[0].style.backgroundImage='url("./src/'+mapName+'c.png")'

/*function loadSample(url) {
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
}*/

function updateKey(){
    player.pressTurn=0;
    player.pressAccelerate=0;
    if(listKeyPressed['Enter']) player.endRefresh();
    if(listKeyPressed['s']||listKeyPressed['ArrowDown']) player.pressAccelerate=-1;
    if(listKeyPressed['z']||listKeyPressed['ArrowUp']) player.pressAccelerate=1;
    if(listKeyPressed['q']||listKeyPressed['ArrowLeft']) player.pressTurn=1;
    if(listKeyPressed['d']||listKeyPressed['ArrowRight']) player.pressTurn=-1;
    if(player.onJump && !player.drift && listKeyPressed[' ']){
        player.drift=player.pressTurn;
    }
}
document.addEventListener('keydown',function(e){
    if(game.playable){
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
                    themeMusic=new Audio('./src/audio/music-map1.ogg');
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
    }
})
window.addEventListener('blur',function(e){
    if(toggleMusic===0){
        toggleMusic=1
        themeMusic.pause();
    }

})
window.addEventListener('focus',function(e){
    if(toggleMusic===1) {
        toggleMusic = 0
        themeMusic.play();
    }
})
document.addEventListener('keyup',function(e){
    if(game.playable) {
        if (e.key === " ") {
            player.drift = 0;
        }
        if (e.key === "Escape") {
            onPause = !onPause;
            game.pause(onPause);
        }
        listKeyPressed[e.key] = 0;
        updateKey();
    }
})

class game {
    static playable=false;
    static initGame(){
        screen.updateShowing();
        game.startGame();
    }
    static enablePlay(playable=true){
        game.playable=playable;
    }
    static startGame(){
        game.lakituStart();
        game.lakituShow();
        setTimeout(()=>{
            game.lakituStarted();
            game.startBip();
            setTimeout(()=>{
                game.enablePlay()
                toggleMusic=0;
                themeMusic.play();
                game.lakituHide();
            },4000)
        },1500)
    }
    static startBip(count=0){
        setTimeout(()=>{
            if(count<3){
                game.bip()
                game.startBip(count+1)
            }
            else{
                game.bip(true)
            }
        },1000)
    }
    static bip(final=false){
        if(final){
            music.playSound("start-race-bip2",0.1)
        }else{
            music.playSound("start-race-bip1",0.15)
        }
    }
    static lakituStart(){
        let lakitu=document.querySelector("lakitu")
        lakitu.classList.value="start";
    }
    static lakituStarted(){
        let lakitu=document.querySelector("lakitu")
        lakitu.classList.value="started show";
    }
    static lakituGrap(){
        let lakitu=document.querySelector("lakitu")
        lakitu.classList.value="grap";
    }
    static lakituBack(){
        let lakitu=document.querySelector("lakitu")
        lakitu.classList.value="back";
    }
    static lakituLap(lap=2,max=2){
        let lakitu=document.querySelector("lakitu")
        lakitu.classList.value="lap";
        lakitu.querySelector("grap").classList.value="l"+lap+"-"+max;
    }
    static lakituShow(){
        let lakitu=document.querySelector("lakitu")
        lakitu.classList.add("show")
    }
    static lakituHide(){
        let lakitu=document.querySelector("lakitu")
        lakitu.classList.remove("show")
    }
    static recommencer(){
        location="race.html";
    }

    static quitter(){
        location="main.html";
    }

    static pause(pause=onPause){
        onPause=pause;
        if(pause){
            game.playable=false;
            toggleMusic=1
            themeMusic.pause();
            TimeStartGame=Date.now()-TimeStartGame;
            document.body.classList.add('paused')
            player.pause();
            music.playSound("menu1",0.5)
        }else{
            if(document.body.classList.contains('paused')){
                game.playable=true;
                toggleMusic=0;
                themeMusic.play();
                TimeStartGame=Date.now()-TimeStartGame;
                document.body.classList.remove('paused')
                player.resume();
                music.playSound("menu2",0.5)
            }
        }
    }
}

class screen{
    static enableTime=false;
    static enableLap=true;
    static elLap=document.querySelector("#screen #lap span");
    static elTime=document.querySelector("#screen #timer span");
    static updateShowing(){
        if(!screen.elTime.parentNode.classList.contains("hide") && !screen.enableTime)
            screen.elTime.parentElement.classList.add("hide")
        if(screen.elTime.parentElement.classList.contains("hide") && screen.enableTime)
            screen.elTime.parentElement.classList.remove("hide")
        if(!screen.elLap.parentElement.classList.contains("hide") && !screen.enableLap)
            screen.elLap.parentElement.classList.add("hide")
        if(screen.elLap.parentElement.classList.contains("hide") && screen.enableLap)
            screen.elLap.parentElement.classList.remove("hide")
    }
    static setTime(){
        if(!screen.enableTime) return;
        let now=Date.now()-TimeStartGame;
        let ms=now.toString().slice(-3);
        let sec=('0' + Math.floor(now/1000)%60).slice(-2);
        let min= Math.floor(now/60000);
        screen.elTime.innerHTML=min+":"+sec+":"+ms
    }
    static lap(player){
        if(!screen.enableLap) return;
        if(screen.elLap){
            screen.elLap.innerText=player.lap+"/"+map.nbLap;
        }
    }
}

class map{
    static mapName="map-1";
    static elMap=null;
    static mapLoaded=false;
    static lapList=[];
    static nbLap=3;
    static loadMapObj(){
        map.elMap=document.querySelector("map");
        map.readJsonFile(map.mapName,(data)=>{
            map.createObj(data.objet)
            map.lapList=data.lap
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
            music.listPlayer[name]=new Audio('./src/audio/' + name + '.ogg');
        }else{
            if(music.listPlayer[name].played){
                let audio = new Audio('./src/audio/' + name + '.ogg');
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
            "#d89820":"sand",
            "#ffffff":"lap"
        }
        if(bloc.isCanvasSet()){
            let pickx=Math.round((1000-(posx+500))*1.024),
                picky=Math.round((1000-(posy+500))*1.025),
                current=bloc.DataToHex(contextCanvas.getImageData(pickx,picky, 1, 1).data);
            return listType[current]??"unknown floor";
        }
    }
    static isCanvasSet(){
        if(!contextCanvas){
            return false;
        }
        return true;
    }
    static evalBump(posx,posy,speed){
        if(bloc.isCanvasSet()){
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
    stepLap=0;
    lap=1;
    map=document.querySelector('map');
    loopRefresh=null;
    constructor(){
        screen.lap(this);
        document.querySelector("player").classList.add(localStorage.getItem("player"));
        this.pause();
        this.resume();
    }
    pause(){
        this.endRefresh();
    }
    resume(){
        this.dTime=Date.now();
        this.loopRefresh=setInterval(() => {
            this.fixLag=(Date.now()-this.dTime)/25;
            this.dTime=Date.now();
            /*if(0 && !this.engineSound && firstInteract){
                this.engineSound=1
                loadSample('./src/audio/engine3.ogg')
                    .then(sample => {
                        this.engineSound=playSample(sample)
                        this.engineSound.playbackRate.value = 2;
                    });
            }*/
            if(this.statechange || this.pressTurn || this.pressAccelerate){
                this.statechange=1;
                this.itemChangement()
                this.refresh();
                screen.setTime();
                if(this.engineSound && this.engineSound!==1) this.engineSound.playbackRate.value=Math.abs(this.vitesse/5)+0.3;
                if(devmod) {
                    info="posx: "+this.posx+
                        "\nposy: "+this.posy+
                        "\nrotate: "+this.rotate+
                        "\nvitesse: "+this.vitesse+
                        "\npieces: "+this.pieces+
                        "\ndrift: "+this.drift+
                        "\nsol: "+this.floor+
                        "\nlap: "+this.lap+
                        "\nlap step: "+this.stepLap+
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
                this.statLap();
                this.setObject();
            }
        },20);
    }
    statLap(){
        if(this.stepLap>=0 && map.lapList.length){
            let x=map.lapList[this.stepLap].x,
                y=map.lapList[this.stepLap].y,
                mapW=-map.elMap.clientWidth/100,
                mapH=-map.elMap.clientHeight/100,
                size=map.lapList[this.stepLap].size*(-mapW);
            x=Math.abs(((x-50)*mapW)-this.posx);
            y=Math.abs(((y-50)*mapH)-this.posy);
            if(x<size && y<size){
                this.stepLap++;
                if(this.stepLap===map.lapList.length) this.stepLap=-1;
            }
        }else{
            if(this.floor==="lap"){
                player.lap++;
                screen.lap(this);
                this.stepLap=0;
            }
        }
    }
    itemChangement(){
        if(this.changeItem) document.getElementsByTagName("item")[0].style.backgroundPositionX="-"+Math.floor(Math.random()*8.99)+"em";
    }
    interactObject(objet,that){
        switch (objet.tagName){
            case "COIN":
                that.pieces++;
                music.playSound("coin",0.5)
                objet.remove();
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
                objet.remove();
                break;
            case "PIPE":
                if(this.vitesse>=2) music.playSound("bump",0.5)
                that.Bump(parseInt(objet.dataset.x),parseInt(objet.dataset.y),8)
                break;
            case "TREE":
                if(this.vitesse>=2) music.playSound("bump",0.5)
                that.Bump(parseInt(objet.dataset.x),parseInt(objet.dataset.y),5)
                break;
        }
    }
    Bump(x1,y1,distance){
        let a=Math.abs(this.acceleration)
        if(Math.abs(this.posx-x1)<distance){
            if(this.posx<x1){
                this.posx-=a
            }else{
                this.posx+=a
            }
            this.vitesse=0;
            this.acceleration=0;
        }
        if(Math.abs(this.posy-y1)<distance){
            if(this.posy<y1){
                this.posy-=a
            }else{
                this.posy+=a
            }
            this.vitesse=0;
            this.acceleration=0;
        }

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
            }
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
            if(distance*backAng<-40 && bottom!==-5000){
                bottom=-5000
                objet.style.bottom=bottom+"px";
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
        if(this.drift && this.vitesse>0){
            this.turnAnim=3;
            this.turnAnim+=this.pressTurn*this.drift;
            this.turnAnim*=this.drift;
            this.rotate+=(this.drift*1.3+this.pressTurn*0.8)*this.fixLag;
        }else{
            if(this.turnAnim===4*this.pressTurn) this.turnAnim-=this.pressTurn;
            if(this.pressTurn){
                let r=Math.abs(this.vitesse/2);
                if(0 && devmod) this.rotate+=(this.pressTurn*2)*this.fixLag;
                else this.rotate+=(this.pressTurn*Math.log(r + 1)*1.3)*Math.sign(this.vitesse)*this.fixLag;//(Math.pow(Math.exp(1),-Math.pow(((r * 50 - 3) / 150),2))*Math.log(r + 1))*this.pressTurn*10;
                if(Math.abs(this.turnAnim+this.pressTurn)<2) this.turnAnim+=this.pressTurn;
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
        let anim=0;
        let spriteY="-1em",spriteX="0em";
        if(this.vitesse<0 && !player.classList.contains("reverse")){
            kart.classList.add("reverse")
        }else{
            if(kart.classList.contains("reverse")) kart.classList.remove("reverse");

            if(this.drift>0 || (!this.drift && this.turnAnim>0)) kart.classList.add("mirror");
            else kart.classList.remove("mirror");
            if(this.turnAnim) anim=Math.abs(this.turnAnim);
            spriteX="-"+anim+"em";
            if(!this.vitesse&&this.turnAnim) spriteY="0em";
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
        let v=this.vitesse;
        if(this.floor=="sand"){
            this.vitesse=Math.min(this.acceleration/1.5,this.vMax/1.5);
            v=this.vitesse/1.2
        }
        this.posx+=Math.sin(this.rotate*Math.PI/180)*(v*this.fixLag);
        this.posy+=Math.cos(this.rotate*Math.PI/180)*(v*this.fixLag);
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
window.onload=()=>{
    setTimeout(()=>{
        game.initGame();
        if(!firstInteract){
            firstInteract=true;
            music.playSound("start-race",0.2)
        }
        document.body.classList.remove("load");
    },10)
}
