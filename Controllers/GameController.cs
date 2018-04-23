using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SocialLogin.Models;

namespace SocialLogin.Controllers
{
    public class GameController : Controller
    {
        [HttpGet]
        [Route("EarthDefenderSingle")]
        public IActionResult EarthDefenderSingle()
        {
            return View("EarthDefenderSingle");
        }

        [HttpGet]
        [Route("EarthDefenderMulti")]
        public IActionResult EarthDefenderMulti()
        {
            return View("EarthDefenderMulti");
        }

    }
}
