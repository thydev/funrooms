using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SocialLogin.Models;

namespace SocialLogin.Controllers
{
    public class WhiteBoardController : Controller 
    {
        [HttpGet]
        [Route("WhiteBoard")]
        public IActionResult WhiteBoardRoom()
        {
            return View("WhiteBoard");
        }
    }
}