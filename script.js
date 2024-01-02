document.addEventListener("DOMContentLoaded", () => {
    const zipCodeInput = document.getElementById("zip-code");
    const getWeatherButton = document.getElementById("get-weather");
  
    // Event listener for the "Get Weather" button
    getWeatherButton.addEventListener("click", () => {
      const zipCode = zipCodeInput.value;
  
      // Step 1: Fetch weather data based on the user's zip code (replace 'YOUR_WEATHER_API_KEY' with your actual API key)
      fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=a19185f10075ce7c80e43d04557895e8`)
        .then((response) => response.json())
        .then((weatherData) => {
          // Extract relevant weather information from the API response
          const temperature = weatherData.main.temp;
          const weatherDescription = weatherData.weather[0].description;
  
          // Step 2: Determine the Spotify playlist based on weather conditions
          let playlistName = "Default Playlist"; // Default playlist name
          if (weatherDescription.includes("rain")) {
            playlistName = "Rainy Day";
          } else if (weatherDescription.includes("cloud")) {
            playlistName = "Cloudy Vibes";
          } else if (temperature > 25) {
            playlistName = "Summer Hits";
          } else if (temperature < 10) {
            playlistName = "Cozy Winter";
          }
  
          // Step 3: Redirect the user to Spotify for authentication
          redirectToSpotifyAuthentication(playlistName);
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
        });
    });
  
    // Function to redirect to Spotify for authentication
    function redirectToSpotifyAuthentication(playlistName) {
      const CLIENT_ID = "YOUR_SPOTIFY_CLIENT_ID";
      const REDIRECT_URI = "http://localhost:3000/callback";
      
      // Construct the Spotify authorization URL
      const spotifyAuthURL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=user-library-read`;
      
      // Redirect the user to Spotify for authentication
      window.location.href = spotifyAuthURL;
    }
  });
  