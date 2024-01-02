# Cloudy_Spotify
A web app that combines real-time weather data with Spotify's music recommendations. Users input their location, and the app suggests playlists or songs that match the current weather, enhancing their music experience. Technical skills involved include HTML, CSS, JavaScript, Python (Flask), API integration, and web deployment.

## Files

- **index.html:** The main HTML file that provides the user interface for the web application. It includes input fields for the zip code and displays the recommended Spotify playlists.

- **style.css:** The Cascading Style Sheets (CSS) file that defines the visual styling and layout of the web application. It styles the HTML elements to make the application visually appealing.

- **script.js:** The JavaScript file responsible for handling user interactions, fetching weather data, determining Spotify playlist recommendations, and handling the Spotify authentication redirect. It contains the client-side logic for the application.

- **app.py:** The Python backend script that serves as the server for the web application. It defines routes for handling requests related to weather data and Spotify recommendations. The backend interacts with external APIs, processes data, and communicates with the front end.

- **requirements.txt:** A text file that lists the Python packages and dependencies required to run the Python backend (app.py). You can use this file to install the necessary packages using pip.

- **config.py:** A Python module that stores sensitive information such as API keys and secrets. It is used to securely store your Spotify API credentials and other configuration values. Ensure that this file is included in your .gitignore to keep your credentials safe and not publicly visible in your version control system.

## Usage

1. Start the backend server by running `app.py`. Ensure that you have installed the required Python packages listed in `requirements.txt`.

2. Open the web application by opening `index.html` in a web browser.

3. Enter your zip code and click the "Get Weather" button to retrieve weather data and receive Spotify playlist recommendations.

## Configuration

- Make sure to replace the placeholder values in `config.py` (e.g., Spotify Client ID and API keys) with your actual credentials before deploying the application.

## Dependencies

- This project depends on several libraries and APIs, including OpenWeatherMap for weather data and the Spotify API for playlist recommendations. Ensure that you have the necessary API keys and client credentials to access these services.


