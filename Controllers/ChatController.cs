using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SocialLogin.Models;

namespace SocialLogin.Controllers
{
    public class ChatController : Controller
    {
        [HttpGet]
        [Route("MainRoom")]
        public IActionResult MainRoom()
        {
            return View("Chat");
        }

        [HttpGet]
        [Route("MainRoom2")]
        public IActionResult MainRoom2()
        {
            return View("ChatPresence");
        }

        [HttpGet]
        [Route("MoveShape")]
        public IActionResult MoveShape()
        {
            return View("MoveShape");
        }

        [HttpGet]
        [Route("Draw")]
        public IActionResult Draw()
        {
            return View("Draw");
        }
        
    }
}
