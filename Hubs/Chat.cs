// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SocialLogin;
using SocialLogin.Models;
using Newtonsoft.Json;

namespace SocialLogin.Hubs
{
    [Authorize]
    public class Chat : HubWithPresence
    {
        public Chat(IUserTracker<Chat> userTracker)
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

        public async Task Send(string message)
        {
            await Clients.All.SendAsync("Send", Context.User.Identity.Name, message);
        }



        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message + "All");

        }


        public async Task Counter(int counting)
        {
            counting++;
            await Clients.All.SendAsync("CounterClient", counting);
        }

        public async Task IncreaseBar(int width, bool isRight)
        {
            width = isRight ? width + 10 : width - 10;
            await Clients.All.SendAsync("increaseBarClient", width);
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


        public async Task MoveShape(int x , int y)
        {
            await Clients.Others.SendAsync("shapeMoved", x, y);
        }

        public async Task Draw(int prevX, int prevY, int currentX, int currentY, string color)
        {
            await Clients.Others.SendAsync("draw", prevX, prevY, currentX, currentY, color);
        }

        public async Task UpdateGameState(GameState gameState )
        {
            System.Console.WriteLine();

            System.Console.WriteLine(gameState.shipName);
            System.Console.WriteLine(gameState.currentScore);
            System.Console.WriteLine(gameState.destroyedAsteroid);
            System.Console.WriteLine();
            await Clients.All.SendAsync("getGameState", JsonConvert.SerializeObject(gameState));
        }
    }
}
