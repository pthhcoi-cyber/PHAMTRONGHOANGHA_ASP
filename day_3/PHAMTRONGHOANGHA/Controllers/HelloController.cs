using Microsoft.AspNetCore.Mvc;
using System.Text.Encodings.Web;

namespace PHAMTRONGHOANGHA.Controllers
{
    public class HelloController : Controller
    {
        [Route("xin-chao")]
        public IActionResult Index()
        {
            return View();
        }

        [Route("xin-chao/welcome")]
        public IActionResult Welcome(String name, int ID = 1)
        {
            ViewData["Name"] = name;
            ViewData["ID"] = ID;
            return View();
        }
        [Route("cham")]
        public IActionResult cham(String name , int Numtimes = 1 )
        {
            ViewBag.Name = "hapromax";
            ViewBag.Numtimes = Numtimes;
            return View();
        }
    }
}