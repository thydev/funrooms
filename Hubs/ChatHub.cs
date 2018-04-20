using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace SocialLogin.Hubs
{
    public static class UserHandler
    {
        public static HashSet<string> ConnectedIds = new HashSet<string>();
    }

    public class ChatHub : Hub 
    {

        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message + "All");

        }

        public async Task Counter(int counting)
        {
            counting++;
            await Clients.All.SendAsync("CounterClient", counting);
        }

        
        public Task SendMessageToCaller(string message)
        {
            return Clients.Caller.SendAsync("ReceiveMessage", message + "caller");
        }

        public Task SendMessageToGroups(string user, string message)
        {
            List<string> groups = new List<string>() { "SignalR Users" };
            return Clients.Groups(groups).SendAsync("ReceiveMessage" , message + "Group");
        }

        public Task SendMessageToRooms(string user, string message, string chatroom)
        {
            List<string> groups = new List<string>() { chatroom };
            return Clients.Groups(groups).SendAsync($"ReceiveMessage{chatroom}" , message + "Group");

        }

        public override async Task OnConnectedAsync()
        {
            System.Console.WriteLine("");
            System.Console.WriteLine("Connected: " + Context.ConnectionId);
            System.Console.WriteLine("");

            
            UserHandler.ConnectedIds.Add(Context.ConnectionId);


            await Groups.AddAsync(Context.ConnectionId, "SignalR Users");
            
            await base.OnConnectedAsync();
        }

        
        public Task Subscribe(string chatroom)
        {
            System.Console.WriteLine("Subscribing:" + Context.ConnectionId);
            return Groups.AddAsync(Context.ConnectionId, chatroom);
        }

        public Task UnSubscribe(string chatroom)
        {
            System.Console.WriteLine("UnSubscribing:" + Context.ConnectionId);
            return Groups.RemoveAsync(Context.ConnectionId, chatroom);
        }

        
    }
}