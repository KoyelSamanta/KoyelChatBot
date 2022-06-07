var express= require('express');
var socket= require('socket.io');

var app=express();
var server=app.listen(4001);

app.use(express.static('public'));

var jsonobj={};
let i=0;

var io=socket(server);


io.on('connection', function(socket){
    //console.log('made socket connection',socket.id);
    //console.log(i);
    socket.on('myconnect',data=> {
        //console.log(data);
        i++;
        let myData={name: data.handel, id: socket.id};
        //console.log(myData);
        let dataNo="data"+i;
        //console.log(dataNo);
        jsonobj[dataNo]=myData;
        socket.join(data.handel);
        socket.emit('myconnect', data);
        //console.log("joined "+data.handel);
        //io.to(data.handel).emit('myAdd', data);}
        io.sockets.emit('people', {jsonobj, i});

    });

    socket.on('myAdd',data=> {
        //console.log(data);
        var socketNo=0;
        for(j=1;j<=i;j++)
        {
            let dt="data"+j;
            if(jsonobj[dt].name===data.handel)
                socketNo=jsonobj[dt].id;
        }
        if(socketNo!=0){
        var socketA=socketNo.socket
        //console.log(socketA);
        //console.log(socketNo);
        socket.join(data.handel);
        console.log("joined in"+(data.handel));
        io.to(data.handel).emit('myAdd', data);}
        
    });

    socket.on('join', data=> {
        //console.log(io.sockets.adapter.rooms.get(roomName).size);
        socket.join(data.group);
        io.to(data.handel).emit('join',data);
    })
   //console.log(jsonobj);
    socket.on('chat', data => {
        try{
        //console.log(data);
        let socketNo=0;
        for(j=1;j<=i;j++)
        {
            let dt="data"+j;
            if(jsonobj[dt].name===data.person)
                socketNo=jsonobj[dt].id;
        }
        if(socketNo==0&&j>i)
        {
            //console.log(socketNo);
            let data1={name: data.person, msg: 'is not available for messaging'};
            throw data1;
        }
        console.log(socketNo);
        io.to(data.handel).to(socketNo).emit('chat', data);
    }catch(e){
        console.log(e);
        io.to(data.handel).emit('error',e)
    }
});
    socket.on('mybroadcast', data => {
        //console.log(data);

        io.to(data.group).emit('chat', data);
    });

    socket.on('typing', data => {
        socket.to(data.handel).to(data.person).emit('typing', data)
    });
    socket.on('typingBrd', data =>{
        io.to(data.group).emit('typingBrd', data);
    })
    
}
);

