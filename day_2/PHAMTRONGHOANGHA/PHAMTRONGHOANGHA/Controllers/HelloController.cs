using Microsoft.AspNetCore.Mvc;
using System.Text.Encodings.Web;

namespace PHAMTRONGHOANGHA.Controllers
{
    public class HelloController : Controller
    {
        public String Index()
        {
            return ("Hello, World!");
        }

        public String Welcome(String name, int numTimes = 1)
        {
            return HtmlEncoder.Default.Encode($"Hello {name}, NumTimes is: {numTimes}");
        }
    }
}