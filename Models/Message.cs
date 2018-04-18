namespace SocialLogin.Models
{
    public class Message : BaseEntity
    {
        public int MessageId { get; set; }
        public string MessageText { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
    }
}