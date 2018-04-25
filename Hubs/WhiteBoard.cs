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
        public WhiteBoard(IUserTracker<WhiteBoard> userTracker)
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
        
        public override Task OnUsersLeft(UserDetails[] users)
        {
            return Clients.Client(Context.ConnectionId).SendAsync("UsersLeft", users);
        }
        
        public Task SendMessageToCaller(string message)
        {
            return Clients.Caller.SendAsync("ReceiveMessage", message + "caller");
        }

        public async Task Draw(int prevX, int prevY, int currentX, int currentY, string color)
        {
            await Clients.Others.SendAsync("draw", prevX, prevY, currentX, currentY, color);
        }
    }
}