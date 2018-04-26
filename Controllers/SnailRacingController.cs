using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SocialLogin.Models;

namespace SocialLogin.Controllers{
    public class SnailRacingController : Controller 
    {
        [HttpGet]
        [Route("SnailRacing")]
        public IActionResult SnailRacingRoom()
        {
            return View("SnailRacing");
        }
    }
}