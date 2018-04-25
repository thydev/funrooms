
var usercolorobj = {};
var count = 0;
var color = ["red", "green", "blue", "purple", "darkgold", "black", "orange", "dodgerblue", "violet", "tomato", "magenta"];
$(document).ready(function(){
    console.log("Ready Whiteboard");
    $("#canvas").mouseout(function(){
        clearMousePositions();
    });

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var canvasx = $(canvas).offset().left;
    var canvasy = $(canvas).offset().top;
    var last_mousex = last_mousey = 0;
    var mousex = mousey = 0;
    var mousedown = false;
    var tooltype = 'draw';

    $(canvas).on('mousedown', function (e) {
        last_mousex = mousex = parseInt(e.clientX - canvasx);
        last_mousey = mousey = parseInt(e.clientY - canvasy);
        mousedown = true;
    });

    $(canvas).on('mouseup', function (e) {
        mousedown = false;
    });

    var drawCanvas = function (prev_x, prev_y, x, y, clr) {
        ctx.beginPath();
        console.log("X: " + x + " Y: " + y);
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = clr
        ctx.lineWidth = 3;
        ctx.moveTo(prev_x, prev_y);
        ctx.lineTo(x, y);
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.stroke();
    };

    $(canvas).on('mousemove', function (e) {
        mousex = parseInt(e.clientX - canvasx);
        mousey = parseInt(e.clientY - canvasy);
        var clr = $('select[id=color]').val()

        if ((last_mousex > 0 && last_mousey > 0) && mousedown) {
            drawCanvas(mousex, mousey, last_mousex, last_mousey, clr);
            connection.invoke('Draw', last_mousex, last_mousey, mousex, mousey, clr);
        }
        last_mousex = mousex;
        last_mousey = mousey;

        $('#output').html('current: ' + mousex + ', ' + mousey + '<br/>last: ' + last_mousex + ', ' + last_mousey + '<br/>mousedown: ' + mousedown);
    });

    var mouse_down = false;

    const connection = new signalR.HubConnection('/whiteboard', { logger: signalR.LogLevel.Information });
    connection.on('draw', function (prev_x, prev_y, x, y, clr) {
        console.log("X: " + x + " Y: " + y);
        drawCanvas(prev_x, prev_y, x, y, clr);
    });
    connection.on('SetUsersOnline', usersOnline => {
        usersOnline.forEach(user => addUserOnline(user));
    });

    connection.on('UsersJoined', users => {
        users.forEach(user => {
            appendLine('User ' + user.name + ' joined the chat', 'green');
            addUserOnline(user);
        });
    });

    connection.on('UsersLeft', users => {
        users.forEach(user => {
            appendLine('User ' + user.name + ' left the chat', 'red');
            document.getElementById(user.connectionId).outerHTML = '';
        });
    });
    connection.start();

    function addUserOnline(user) {
        if (document.getElementById(user.connectionId)) {
            return;
        }
        var userLi = document.createElement('p');
        userLi.innerText = `${user.name}`;
        userLi.id = user.connectionId;
        while(count<color.length){
        var usercolor = color[count];
        userLi.style.color = usercolor;
        usercolorobj[user.name] = usercolor;
            count++;
            if(count == 10){
                count = 0;
            }
            break;
        }
        document.getElementById('users').appendChild(userLi);
    }
    clearMousePositions = function () {
        last_mousex = 0;
        last_mousey = 0;
    }
});