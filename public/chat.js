var socket = io.connect('http://192.168.4.31:4001/');

var myOutput=$("#output").val();
var myList=$("#added").val();
var myName=document.getElementById("name");
var toWhom=document.getElementById("whom");
var myMessage=document.getElementById("msg");
var myBroadMsg=document.getElementById('msgBrd');
var feedBack=document.getElementById("feedback");
var btnConnect=document.getElementById("connect");
//var btnAdd=document.getElementById("add");
var btnJoin=document.getElementById("join");
//console.log(btnJoin);

var btn=document.getElementById("send");
var btnBrd=document.getElementById("broadcast");
let err=document.getElementById('error');
//$( "#addedPerson" ).append( '<h>'+"hii"+'</h1' );
//console.log(myName.value);

//console.log(btnConnect);
//console.log(myName.value);
let me='';


function clickMe() {
    var text = document.getElementById("grpName");
    text.classList.toggle("hide");
    text.classList.toggle("show");
    var textmsg = document.getElementById("msgBrd");
    textmsg.classList.toggle("hide");
    textmsg.classList.toggle("show");
    var brd = document.getElementById("broadcast");
    brd.classList.toggle("hide");
    brd.classList.toggle("show");
    toWhom.classList.toggle("show");
    toWhom.classList.toggle("hide");
    myMessage.classList.toggle("show");
    myMessage.classList.toggle("hide");
    btn.classList.toggle("show");
    btn.classList.toggle("hide");
    $('#grpName').val('');
    $('#msgBrd').val('');
    $('#msg').val('');
    $('#whom').val('');
    feedBack.innerText='';
    //btnAdd.classList.toggle("show");
    //btnAdd.classList.toggle("hide");
  }

btnConnect.addEventListener('click', function(){
    //var myName=document.getElementById("name").value;
    //console.log(myName.value);
    me=myName.value;
    socket.emit('myconnect',{
        handel: myName.value
    });
});

btnBrd.addEventListener('click', function(){
    //var myName=document.getElementById("name").value;
    //console.log(myName.value);
    var myGroup=document.getElementById("grpName");
    var textmsg = document.getElementById("msgBrd");
    console.log(myName.value);
    socket.emit('mybroadcast',{
        group: myGroup.value,
        message: textmsg.value,
        handel: me
    });
});

btnJoin.addEventListener('click', function(){
    //var myName=document.getElementById("name").value;
    //console.log(myName.value);
    if((myName.value).length>0){
    err.innerText="";
    var slt = document.getElementsByName('grp');
    for (var radio of slt)
    {
        if (radio.checked) {
            //console.log(radio.value);
            //console.log(io.sockets.clients(radio.value));
            radio.hidden=true;
            //$( "#added" ).append('<li>'+radio.value+'</li>')
            socket.emit('join',{
                group:radio.value,
                handel: me
            });
        }
    }}
    else{
        err.innerText="First enter your name";
        err.style.color='red'
    }
    /*socket.emit('myconnect',{
        handel: myName.value
    });*/
});

/*btnAdd.addEventListener('click', function(){
    //var myName=document.getElementById("name").value;
    //console.log(myName.value);
    socket.emit('myAdd',{
        handel: myName.value,
        person: toWhom.value
    });
});*/

btn.addEventListener('click', function(){
    //var myName=document.getElementById("name").value;
    //console.log(myName.value);
    myMessage=document.getElementById("msg");
    console.log(myMessage.value.length);
    if(myMessage.value.length>0){
    socket.emit('chat',{
        message: myMessage.value,
        handel: me,
        person: toWhom.value
    });}
    else{
        let err1=document.getElementById('error1');
        err1.innerText="Please write somthing...";
        err1.style.color='red'
    }
});

myMessage.addEventListener('keypress', function() {
    socket.emit('typing', {
        handel: me,
        person: toWhom.value
    });
    let err1=document.getElementById('error1');
        err1.innerText="";
});

myBroadMsg.addEventListener('keypress', function() {
    var myGroup=document.getElementById("grpName");
    console.log(myGroup);
    socket.emit('typingBrd', {
        group: myGroup.value,
        name: me
    });
    let err1=document.getElementById('error1');
        err1.innerText="";
});

socket.on('chat', data =>{
    console.log(data);

    $( "#output" ).append( '<p><strong>'+data.handel+': '+'</strong>'+data.message+'</p>' );
    $( "#feedback" ).html( '<p></p>' );
    $('#error1').val('');
});

socket.on('mybroadcast', data =>{
    console.log(data);

    $( "#output" ).append( '<p><strong>'+data.handel+': '+'</strong>'+data.message+'</p>' );
    $( "#feedback" ).html( '<p></p>' );
});

socket.on('typing', data => {
    $( "#feedback" ).val('');
    $( "#feedback" ).html( '<p><em>'+data.handel+' is typing</em></p>' );
});


socket.on('join', data => {
    
    $( "#feedback" ).html( '<p><strong>you are added to '+data.group+'</strong></p>');
})

socket.on('myconnect', data => {
    //console.log($('#name').val(data.handel+'is connected'));
    $('#name').val(data.handel+' is connected');
    //$('#name').html('<p><strong>'+data.handel+'is connected</strong></p>');
})

socket.on('people',data => {
    //console.log(myName.value);
    console.log(me);
    console.log(data.jsonobj);
    const container = document.getElementById('people');
    container.textContent = '';
    $( "#people" ).append( '<p><strong>People Available</strong></p>' );
    for(j=1;j<=data.i;j++)
    {
        let sNo='data'+j;
        //console.log(sNo);
        //console.log(data.jsonobj[sNo].name);
        if(data.jsonobj[sNo].name===me){
            $( "#people" ).append( '<p>You</p>' );
        }
        else{
            $( "#people" ).append( '<p>'+data.jsonobj[sNo].name+'</p>' );
        }
    }


})

socket.on('typingBrd', data => {
    $( "#feedback" ).val('');
    console.log('typing2');
    $( "#feedback" ).html( '<p><em>'+data.name+' is typing</em></p>' );
});

socket.on('error',data => {
    console.log(data);
    let err1=document.getElementById('error1');
    err1.innerText=data.name+" is not available now";
    err1.style.color='red'

})