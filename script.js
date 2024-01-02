document.addEventListener("DOMContentLoaded", () => {
    const zipCodeInput = document.getElementById("zip-code");
    const getWeatherButton = document.getElementById("get-weather");
  
    // Event listener for the "Get Weather" button
    getWeatherButton.addEventListener("click", () => {
      const zipCode = zipCodeInput.value;
  
      // Step 1: Fetch weather data based on the user's zip code (you need to replace 'YOUR_WEATHER_API_KEY' with your actual API key)
      fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=YOUR_WEATHER_API_KEY`)
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
  
          // Step 3: Fetch Spotify playlist based on the determined name (you need to replace 'YOUR_SPOTIFY_API_KEY' with your actual API key)
          fetch(`https://api.spotify.com/v1/playlists/${playlistName}`, {
            headers: {
              Authorization: `Bearer YOUR_SPOTIFY_API_KEY`, // Replace with your Spotify API token
            },
          })
            .then((response) => response.json())
            .then((playlistData) => {
              // Step 4: Display the Spotify playlist or take further actions based on the data
              const playlistTracks = playlistData.tracks.items;
              const playlistContainer = document.getElementById("playlist-container");
  
              // Clear any previous playlist content
              playlistContainer.innerHTML = "";
  
              // Display the playlist tracks on the webpage
              playlistTracks.forEach((track) => {
                const trackName = track.track.name;
                const artistName = track.track.artists[0].name;
  
                // Create an HTML element to display the track
                const trackElement = document.createElement("p");
                trackElement.textContent = `${trackName} by ${artistName}`;
                playlistContainer.appendChild(trackElement);
              });
            })
            .catch((error) => {
              console.error("Error fetching Spotify playlist:", error);
            });
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
        });
    });
  });
  