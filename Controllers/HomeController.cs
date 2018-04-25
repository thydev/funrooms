using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SocialLogin.Models;

namespace SocialLogin.Controllers
{
    public class HomeController : Controller
    {
        [HttpGet]
        [Route("")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [Route("About")]
        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        [HttpGet, Route("Contact")]
        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        [HttpGet, Route("Privacy")]
        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
