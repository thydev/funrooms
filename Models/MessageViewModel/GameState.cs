
namespace SocialLogin.Models
{
    public class GameState
    {
        public string main { get; set; }
        public string game { get; set; }
        public string shipName { get; set; }
        public int currentScore { get; set; }
        public int destroyedAsteroid { get; set; }
    }

    public class ship
    {
        public double startX { get; set; }
        public double startY { get; set; }
        public int acceleration { get; set; }
        public int drag { get; set; }
        public int maxVelocity { get; set; }
        public int angularVelocity { get; set; }
        public int startingLives { get; set; }
        public int timeToReset { get; set; }
        public double blinkDelay { get; set; }

    }

    public class Bullet
    {
        public int speed { get; set; }
        public int interval { get; set; }

        public int lifespan { get; set; }
        public int maxCount { get; set; }

    }

    public class Asteroid
    {
        public int startingAsteroids { get; set; }
        public int maxAsteroids { get; set; }
        public int incrementAsteroids { get; set; }
    }

    // asteroidLarge: { minVelocity: 50, maxVelocity: 150, minAngularVelocity: 0, maxAngularVelocity: 200, score: 20, 
    // nextSize: graphicAssets.asteroidMedium.name, pieces: 2, explosion:'explosionLarge' },
    public class AsteroidLarge : Asteroid
    {
        public int minVelocity { get; set; }
        public int maxVelocity { get; set; }
        public int minAngularVelocity { get; set; }
        public int maxAngularVelocity { get; set; }
        public int score { get; set; }
        public string nextSize { get; set; }
        public int pieces { get; set; }
        public string explosion { get; set; }
    }

    // asteroidMedium: { minVelocity: 50, maxVelocity: 200, minAngularVelocity: 0, maxAngularVelocity: 200, score: 50, nextSize: graphicAssets.asteroidSmall.name, pieces: 2, explosion:'explosionMedium' },
    public class asteroidMedium : Asteroid
    {
        public int minVelocity { get; set; }
        public int maxVelocity { get; set; }
        public int minAngularVelocity { get; set; }
        public int maxAngularVelocity { get; set; }
        public int score { get; set; }
        public string nextSize { get; set; }
        public int pieces { get; set; }
        public string explosion { get; set; }
    }

    // asteroidSmall: { minVelocity: 50, maxVelocity: 300, minAngularVelocity: 0, maxAngularVelocity: 200, score: 100, explosion:'explosionSmall' },
    public class AsteroidSmall : Asteroid
    {
        public int minVelocity { get; set; }
        public int maxVelocity { get; set; }
        public int minAngularVelocity { get; set; }
        public int maxAngularVelocity { get; set; }
        public int score { get; set; }
        public string explosion { get; set; }
    }
}