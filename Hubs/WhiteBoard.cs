using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SocialLogin;

namespace SocialLogin.Hubs
{
    [Authorize]
    public class WhiteBoard : HubWithPresence
    {
        public WhiteBoard(IUserTracker<GrowingTree> userTracker)
            : base(userTracker)
        {

        }
        public override async Task OnConnectedAsync()
        {
            await Clients.Client(Context.ConnectionId).SendAsync("SetUsersOnline", await GetUsersOnline());
            await base.OnConnectedAsync();
        }

        public override Task OnUsersJoined(UserDetails[] users)
        {
            
            return Clients.Client(Context.ConnectionId).SendAsync("UsersJoined", users);
        }
        public async Task Counter(int counting)
        {
            counting++;
            await Clients.All.SendAsync("CounterClient", counting);
        }

        public override Task OnUsersLeft(UserDetails[] users)
        {
            return Clients.Client(Context.ConnectionId).SendAsync("UsersLeft", users);
        }
        
        public Task SendMessageToCaller(string message)
        {
            return Clients.Caller.SendAsync("ReceiveMessage", message + "caller");
        }
    }
}