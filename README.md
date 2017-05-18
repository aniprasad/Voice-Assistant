A Simple Voice assistant which converts voice commands to functional calls. 

This application uses Microsoft's Speech to Text API to parse speech to text. It then uses the parsed text along with a handful of API's to get relevant information.

For now, the application, can procure the weather information, soccer results, play songs, show places of interests near locations and provide navigational instructions

List of Commands:

1) Weather - Gets the weather based on the voice query
    "Weather { <i>any city name</i> }"
    "Weather { <i>any country name</i> }"
    "Weather { <i>any postal code</i> }"

    The following gif shows the results for "Weather Toronto" and "Weather Montreal"

    ![Alt Text](https://github.com/aniprasad/Voice-Assistant/raw/master/gifs/weather.gif)


2) Soccer/Football Information - Gets relevant soccer information
    
    "Soccer/Football standings { <i>League codes </i>}"
     List of <i>"League codes"</i>
        i) "PL" - English Premier League
        ii) "EL1" - English League One
        iii) "FAC" - FA Cup
        iv) "BL1" - Bundesliga
        v) "FL1" - Ligue 1
        vi) "SA" - Serie A
        vii) "PD" - La Liga
   
    "Soccer/Football fixtures { <i> Team Name</i> }" - Team name can be replaced by any major soccer club</li>
                
    "Soccer/Football fixtures next/previous { <i>number</i> } { <i>Team Name</i> }" - Gets upcoming/past "x" fixtures of a particular team
    
    "Soccer scores live" - Get live scores of teams playing in the major European leagues
     
3) Playing Songs
              
    "Play { <i>Song Name</i> }" - Provides a spotify link as well for any song
    
    "Play { <i>Song name</i> } by {<i>Artist name </i>} "
              
4) Places of interest
     
    "Show me { <i>places</i> } near my location"
    
    "Show me { <i>places</i> } near my { <i>address</i> }" - Any complete address eg: 181 Lester St, Waterloo, ON

    List of available <i>"places"</i>
    
      i) Resturants
      ii) Hospitals
      iii) Stores
      iv) Cinemas
      v) Subway
    
5) Navigation 
              
    "Directions from { <i>From address</i> } to { <i>To address</i> } by { <i>transport modes</i> }"
    
    List of "transport modes"</i> available
                    
      i) Car/Driving
      ii) Bus
      iii) Walk
      iv) Cycle/Bike

6) Generic Search Command
    
   "Search { <i> Anything </i> }" - Returns a google search link of any text spoken after "Search"

