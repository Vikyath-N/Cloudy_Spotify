document.addEventListener("DOMContentLoaded", () => {
    const zipCodeInput = document.getElementById("zip-code");
    const getWeatherButton = document.getElementById("get-weather");
  
    // Spotify API credentials (Client ID and Redirect URI)
    const CLIENT_ID = "32fa381477cc42a98058658debebe637";
    const REDIRECT_URI = "http://localhost:3000/callback";
  
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
          const spotifyAuthURL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=user-library-read`;
          window.location.href = spotifyAuthURL;
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
        });
    });
  });
  