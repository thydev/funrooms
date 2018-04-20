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
        "/chathub", { logger: signalR.LogLevel.Information });
    
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
});

