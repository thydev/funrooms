// The following sample code uses modern ECMAScript 6 features 
// that aren't supported in Internet Explorer 11.
// To convert the sample for environments that do not support ECMAScript 6, 
// such as Internet Explorer 11, use a transpiler such as 
// Babel at http://babeljs.io/. 
//
// See Es5-chat.js for a Babel transpiled version of the following code:

$(document).ready(function(){
    console.log("ready");
    const connection = new signalR.HubConnection(
        "/chat", { logger: signalR.LogLevel.Information });
    
    connection.on("ReceiveMessage", (user, message) => { 
        console.log(user, message);
        const encodedMsg = user + ": " + message;
        const li = document.createElement("li");
        li.textContent = encodedMsg;
        document.getElementById("messagesList").appendChild(li);
    });

    connection.on("CounterClient", num => {
        $("#counting").text(num);
    });
    
    connection.on("increaseBarClient", width => {
        $(".box1").width(width);
    });
    connection.on("GrowTreeWidthClient", width => {
        $(".tree").width(width);
    }); 
    connection.on("GrowTreeHeightClient", height => {
        $(".tree").height(height);
    });
    

    connection.on("OnlineUserClient", users => {
        users.forEach(element => {
        const li = document.createElement("li");
        li.textContent = element.name;
        $("#onlineusers").appendChild(li);
        });
        
    });

    $("#sendButton").click( event => {
        const user = $("#userInput").val();
        const message = $("#messageInput").val();  
        connection.invoke("SendMessage", user, message).catch(err => console.error);
        event.preventDefault();
    });
    
    $("#sendButtonCaller").click(function(e){

        const user = $("#userInput").val();
        const message = $("#messageInput").val();
    
        connection.invoke("SendMessageToCaller", message)
            .catch(err => console.error);
        e.preventDefault();
    });
    
    $("#sendButtonGroup").click(function(e){
        console.log("group")
        const user = $("#userInput").val();
        const message = $("#messageInput").val();
    
        connection.invoke("SendMessageToGroups", user, message)
            .catch(err => console.error);
        e.preventDefault();
    });

    $("#countUp").click(function(e){
        var num = $("#counting").text();
        connection.invoke("Counter", num)
            .catch(err => console.error);
        e.preventDefault();
    });

    connection.start(

    )
        .then(() => {
            console.log("Hub started");
        }
        ).catch(err => console.error);
    
    // connection.start(
    //     signalR.TransportType.LongPolling
    // )
    //     .then(() => {
    //         console.log("Hub started");
    //     }
    //     ).catch(err => console.error);
        
        
    // Gesture functions
    gest.options.subscribeWithCallback(function(gesture) {
        var message = '';
        console.log(gesture.direction);

        if (gesture.direction) {
            message = gesture.direction;

            $box = $(".box1");
            console.log($($box).width());
            $tree = $(".tree");
            console.log($($tree).width());
            console.log($($tree).height());
            // console.log(position);
            if (gesture.left) {
                // console.log($($box).width($($box).width() + 10));
                // $box.css("width", position.width - 10);
                // $($box).width($($box).width() - 10)
                connection.invoke("IncreaseBar", $($box).width(), gesture.right)
                    .catch(err => console.error);
        // added gesture up for growing tree
            }
            if (gesture.up) {
                // console.log($($box).width($($box).width() + 10));
                // $box.css("width", position.width - 10);
                // $($box).width($($box).width() - 10)
                connection.invoke("GrowTreeWidth", $($tree).width(), gesture.up)
                connection.invoke("GrowTreeHeight", $($tree).height(), gesture.up)
                    .catch(err => console.error);
            }
            if (gesture.right) {
                // $$box.css("width", position.width + 10);
                // $($box).width($($box).width() + 10)
                connection.invoke("IncreaseBar", $($box).width(), gesture.right)
                    .catch(err => console.error);
            }
        } else {
            message = gesture.error.message;
        } 
        // $("#gestdirection").show();
        // $("#gestdirection").text(message)


        var num = $("#counting").text();
        connection.invoke("Counter", num)
            .catch(err => console.error);

        // window.setTimeout(function() {
        //     $("#gestdirection").hide();
        // }, 3000);
    });
    // gest.start();
    
    $("#startcamera").click(function(e){
        gest.start();
        console.log("started");
        e.preventDefault();
    });
    $("#stopcamera").click(function(e){
        gest.stop();
        console.log("stopped");
        e.preventDefault();
    });
});

