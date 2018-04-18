using System.ComponentModel.DataAnnotations;

namespace SocialLogin.Models
{
    public class User : BaseEntity
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }

    }
}