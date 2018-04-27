
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SocialLogin;
namespace SocialLogin.Hubs
{
    [Authorize]
    public class SnailRace : HubWithPresence
    {
        public SnailRace(IUserTracker<SnailRace> userTracker)
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
            System.Console.WriteLine("Hit this method");
            return Clients.Client(Context.ConnectionId).SendAsync("UsersJoined", users);
        }

        public override Task OnUsersLeft(UserDetails[] users)
        {
            return Clients.Client(Context.ConnectionId).SendAsync("UsersLeft", users);
        }
        public async Task SnailMove(int left, bool isRight)
        {
            System.Console.WriteLine(left);
            left = isRight ? left + 15 : left - 0;
            await Clients.All.SendAsync("SnailMoveClient", left, Context.User.Identity.Name);
        }
        
        public Task SendMessageToCaller(string message)
        {
            return Clients.Caller.SendAsync("ReceiveMessage", message + "caller");
        }
        //
        public async Task StartGame(int pushcount){
            pushcount++;
            await Clients.All.SendAsync("StartGameClient", pushcount);
        }
    }
}