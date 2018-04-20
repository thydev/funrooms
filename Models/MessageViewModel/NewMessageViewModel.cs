using System.ComponentModel.DataAnnotations;

namespace SocialLogin.Models
{
    public class NewMessageViewModel
    {
        [Required]
        public string MessageText { get; set; }
    }
}