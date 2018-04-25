using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SocialLogin.Models;

namespace SocialLogin.Controllers{
    public class MoveShapeController : Controller 
    {
        [HttpGet]
        [Route("MoveShape")]
        public IActionResult MoveShapeRoom()
        {
            return View("MoveShape");
        }
    }
}