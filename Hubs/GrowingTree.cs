
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SocialLogin;
namespace SocialLogin.Hubs
{
    [Authorize]
    public class GrowingTree : HubWithPresence
    {
        public GrowingTree(IUserTracker<GrowingTree> userTracker)
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
        public async Task GrowTreeWidth(int width, bool isRight)
        {
            width = isRight ? width + 8 : width - 0;
            await Clients.All.SendAsync("GrowTreeWidthClient", width);
        }
        public async Task GrowTreeHeight(int height, bool isRight)
        {
            height = isRight ? height + 10 : height - 0;
            await Clients.All.SendAsync("GrowTreeHeightClient", height);
        }
        public Task SendMessageToCaller(string message)
        {
            return Clients.Caller.SendAsync("ReceiveMessage", message + "caller");
        }
        public async Task StartGame(bool isRight){
            // e = isRight;
            await Clients.All.SendAsync("StartGameClient");
        }
    }
}