using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SocialLogin.Models
{
    public class Message : BaseEntity
    {
        [Key]
        public int MessageId { get; set; }
        public string MessageText { get; set; }

        [ForeignKeyAttribute("User")]
        public string UserId { get; set; }
        public AppUser User { get; set; }
    }
}