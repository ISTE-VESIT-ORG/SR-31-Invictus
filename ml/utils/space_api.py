from dotenv import load_dotenv
import os
import requests


N2YO_API_KEY = os.getenv("N2YO_API_KEY")

def get_cloud_cover(lat, lon):

    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&hourly=cloud_cover"
    res = requests.get(url).json()

    cloud_cover = res["hourly"]["cloud_cover"][0]

    return cloud_cover


def get_iss_pass(lat, lon):

    # ISS NORAD ID = 25544
    url = f"https://api.n2yo.com/rest/v1/satellite/visualpasses/25544/{lat}/{lon}/0/1/10/?apiKey={N2YO_API_KEY}"

    res = requests.get(url).json()

    if "passes" in res and len(res["passes"]) > 0:
        altitude = int(res["passes"][0]["maxEl"])
        duration = int(res["passes"][0]["duration"] / 60)
    else:
        altitude = 40
        duration = 3

    return altitude, duration


def get_light_pollution(city):

    urban = ["mumbai", "delhi", "bangalore", "kolkata", "chennai"]

    if city.lower() in urban:
        return 9
    return 5


def get_moon_phase():

    # TEMPORARY SIMULATION (replace later with real API)
    return 35
