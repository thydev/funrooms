using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace SocialLogin.Hubs
{

    public class ChatHub : Hub 
    {

        

        // public override async Task OnConnectedAsync()
        // {
        //     System.Console.WriteLine("");
        //     System.Console.WriteLine("Connected: " + Context.ConnectionId);
        //     System.Console.WriteLine("");

            
        //     UserHandler.ConnectedIds.Add(Context.ConnectionId);

        //     await Groups.AddAsync(Context.ConnectionId, "SignalR Users");
            
        //     await base.OnConnectedAsync();
        // }
        
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