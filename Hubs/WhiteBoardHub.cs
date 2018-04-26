using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SocialLogin;

namespace SocialLogin.Hubs
{
   
    public class WhiteBoardHub  : HubWithPresence
    {
        public WhiteBoardHub(IUserTracker<WhiteBoardHub> userTracker)
            : base(userTracker)
        {

        }
        
        public async Task Draw(int prevX, int prevY, int currentX, int currentY, string color)
        {
            await Clients.Others.SendAsync("draw", prevX, prevY, currentX, currentY, color);
        }
    }
}