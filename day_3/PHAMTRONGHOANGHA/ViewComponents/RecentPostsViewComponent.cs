using Microsoft.AspNetCore.Mvc;

namespace PHAMTRONGHOANGHA.ViewComponents 
{
    public class RecentPostsViewComponent : ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync()
        {
            return View();
        }
    }
}