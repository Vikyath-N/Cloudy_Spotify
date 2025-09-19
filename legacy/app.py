from flask import Flask, request, jsonify
from spotipy import Spotify
from spotipy.oauth2 import SpotifyClientCredentials
import requests
import config

app = Flask(__name__)

# Initialize the Spotify client
client_credentials_manager = SpotifyClientCredentials(
    client_id=config.SPOTIPY_CLIENT_ID, 
    client_secret=config.SPOTIPY_CLIENT_SECRET
)
spotify = Spotify(client_credentials_manager=client_credentials_manager)


@app.route('/get_weather', methods=['POST'])
def get_weather():
    try:
        # Get user's zip code from the request
        data = request.get_json()
        zip_code = data.get('zip_code')

        # Fetch weather data from the weather API
        weather_url = f'https://api.openweathermap.org/data/2.5/weather?zip={zip_code}&appid={config.WEATHER_API_KEY}'
        response = requests.get(weather_url)
        weather_data = response.json()

        # Extract relevant weather information
        temperature = weather_data['main']['temp']
        weather_description = weather_data['weather'][0]['description']

        # Determine the Spotify playlist based on weather conditions
        playlist_name = "Default Playlist"  # Default playlist name
        if 'rain' in weather_description.lower():
            playlist_name = "Rainy Day"
        elif 'cloud' in weather_description.lower():
            playlist_name = "Cloudy Vibes"
        elif temperature > 25:
            playlist_name = "Summer Hits"
        elif temperature < 10:
            playlist_name = "Cozy Winter"

        # Fetch Spotify playlist based on the determined name
        playlist = spotify.search(q=playlist_name, type='playlist', limit=1)['playlists']['items'][0]

        # Extract playlist details
        playlist_id = playlist['id']
        playlist_tracks = spotify.playlist_tracks(playlist_id)['items']

        # Extract track names and artists
        tracks_data = [{'name': track['track']['name'], 'artist': track['track']['artists'][0]['name']} for track in playlist_tracks]

        return jsonify({'temperature': temperature, 'weather_description': weather_description, 'playlist_name': playlist_name, 'tracks': tracks_data})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
