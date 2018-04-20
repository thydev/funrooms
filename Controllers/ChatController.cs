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

    }
}
