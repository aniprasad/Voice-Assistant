
// Set the option based on the key word as given by the input
function setOption(word) {
	var opt = "";
	console.log(word);
	if(word.includes("weather")) {
		opt = "W";
	}
	else if(word.includes("soccer") || word.includes("football")) {
		opt = "F";
	}
	else if(word.includes("information") || word.includes("wiki") || word.includes("wikipedia") || word.includes("info")) {
		opt = "I";
	}
	else if(word.includes("play")) {
		opt = "P";
	}
	else {
		opt = "N";
	}
	return opt;
}

function sanitizeQuery(query) {
	query = query.replace(".", "");
	return query;
}

// Parse the weather query in order to prepare it for input to API
function parseWeatherQuery(query) {
	var queryArr = [];
	// Get the entire input
	var input = query.split(" ");

	// Parse the key word
	var keyWord = input[0];
	// Push the keyword into the array
	queryArr.push(keyWord);
	
	// Join the rest of the input in one string
	var query = input.slice(1, input.length).join(" ");
	query = stringToNumber(query);
	// Push the weather idenitifier
	queryArr.push(query);
	return queryArr;	
}

// Convert string representation of number to actual number itself for 
// the postal code option
function stringToNumber(str) {
	// Only have to check for Postal Code, which would be the second input
	str = str.toLowerCase();
	var replacedFlag = 0;
	var input = str.split(" ");
	var numStrings = ["n/a/", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
	for(var i = 0 ; i < input.length ; i++) {
		if(numStrings.indexOf(input[i]) != -1) {
			replacedFlag = 1;
			var indexFound = numStrings.indexOf(input[i]);
			input[i] = indexFound.toString();
		}
	}
	if(replacedFlag == 1) {
		return input.join("");
	}
	else {
		return input.join(" ");
	}
}

function getWeatherInformation(query) {
	var input = query[1];

	//Construct ajax request to weather php endpoint
	$.ajax({
		url: "weather.php",
		data: { input : input },
		type: "POST",
		dataType: "json",
		success: function(result) {
			console.log("Result:", result);

			if($("#results_heading").attr("id") == "weather_heading") {
				$("#results_heading").removeAttr('id', 'weather_heading');
			}

			$("#results_heading").attr('id', 'weather_heading');
			
			$(".result_heading").addClass("weather_heading");
			$(".result_heading").removeClass("result_heading");

			$(".weather_heading").html("Weather for " + input + ", " + result.location.country);

			$("#results").attr('id', 'weather_results');
			
			if($("#weather_table").attr("id") == "weather_table") {
				$("#weather_table").remove();
			}

			var weather_table = '<table class="table" id="weather_table">';
			weather_table += '<tbody>';

			weather_table += returnWeatherRowStructure("temperature", "Temperature", result.current.temp_c, "&deg C");
			
			weather_table += returnWeatherRowStructure("feels_like", "Feels Like ", result.current.feelslike_c, "&deg C");
			
			weather_table += returnWeatherRowStructure("humidity", "Humidity", result.current.humidity, "%");

			weather_table += returnWeatherRowStructure("wind_speed", "Wind Speed", result.current.wind_kph, "kph");

			weather_table += '</tbody';

			weather_table += '</table>';

			console.log(weather_table);
			
			$("#weather_results").append(weather_table);
			$("#weather_table").addClass("weather_table");
		},
		failure: function(result) {
			console.log("Failure: ", result);
		}
	});
}
   

$("#record_button").click(function() {
	clearHTML();
})
/* Soccer Stuff starts here */
function parseFootballQuery(query) {
	var queryArr = [];
	queryArr = query.split(" ");
	var keyWord = queryArr[0]; // Either Soccer / Football

	var identifier = queryArr[1];
	identifier = identifier.toLowerCase();
	// Standings option requested
	if(identifier.includes("table") || identifier.includes("standings")) {
		// Identify the league requested
		var league = "";
		for(var i = 2 ; i < queryArr.length ; i++) {
			league += queryArr[i];
		}
		getStandings(league);
	}
	else if(identifier.includes("fixtures")) {
		// Usage: Soccer fixtures timeframe <next/previous> <team name>
		// Command : Soccer fixtures next/previous number teamname
		console.log(identifier);
		var timeFrame = queryArr[2];
		var teamName = "";
		var time = "";
		console.log(timeFrame, queryArr[3], typeof parseInt(queryArr[3]) == "number");
		if((timeFrame.includes("next") || timeFrame.includes("previous")) && (typeof parseInt(queryArr[3]) == "number")) {
			// Pull up fixtures with the time frame option
			for(var i = 4; i < queryArr.length ; i++) {
				teamName += queryArr[i] + " ";
			}
			if(timeFrame.includes("next")) {
				time = "n+" + queryArr[3].toString();
				console.log(teamName, time, typeof queryArr[3], queryArr[3]);
			}
			else if(timeFrame.includes("previous")) {
				time = "p+" + queryArr[3].toString();
				console.log("Previous fixtures");
				console.log(teamName, time);
			}
			getTeamInformation(teamName, time);
		}
		else {
			console.log("All Fixtures");
			for(var i = 2 ; i < queryArr.length ; i++) {
				teamName += queryArr[i] + " ";
			}
			console.log(teamName);
			getTeamInformation(teamName, -1);			
		}
	}
	else {
		console.log("TBI!");
	}
}

function parseSongQuery(query) {
	var queryArr=[];
	queryArr = query.split(" ");
	var keyWord = queryArr[0]; // queryArr[0] = "play"
	var songName = "";
	var artistName = "";
	//var artistIndex = 0;
	for(var i = 0 ; i < queryArr.length ; i++) {
		if(queryArr[i].toLowerCase() == "by") {
			songName = queryArr.slice(1, i).join(" ");
			artistName = queryArr.slice(i + 1, queryArr.length).join(" ");
			break;
		}
	}
	//console.log(keyWord, songName, artistName);
	getSongSearchResults(songName, artistName);
}

function getSongSearchResults(song, artist) {
	$.ajax({
		url: "get_song_search.php",
		data: { song : song,
				artist: artist},
		type: "POST",
		dataType: "json",
		success: function(result) {
			console.log("Result:", result);
			playSong(result);
		},
		failure: function(result) {
			console.log("Failure: ", result);
		}
	});
}

function playSong(res) {
	res = res.tracks.items;
	console.log("Play song function ", res);
	var playing = false;
	if(res.length > 0) {
		res = res[0];
		var audio = new Audio();
		var play_artist = res.artists[0].name;
		//var play_song = res.album[0].name;
		//audio.attr("id","play_song");
		audio.src = res.preview_url;
		audio.play();
		playing = true;
		console.log(audio);
	}
	else {
		// No songs to play
		console.log("No Song to Play");
		// Pull up a youtube search maybe?
	}
}

function getStandings(league) {
	var league = league.toUpperCase();
	console.log(league);
	$.ajax({
		url: "get_standings.php",
		data: { input : league.toUpperCase()},
		type: "POST",
		dataType: "json",
		success: function(result) {
			console.log("Result:", result);

			$("#results_heading").attr('id', 'soccer_heading');
			
//			$(".result_heading").removeClass("weather_heading");
//			$(".result_heading").addClass("result_heading");
			//$(".result_heading")
			$(".result_heading").html("League Table");

			$("#results").attr('id', 'soccer_results');
			var soccerTable = '<table class="table" id="soccer_table">';
			soccerTable += '<tbody>';

			// Start row for headings 
			soccerTable += '<tr>';
			// Generate headings 
			soccerTable += generateFootballStandingsHeadings();
			// End row for headings
			soccerTable += '</tr>';

			// Generate data by looping through various teams
			for(var i = 0 ; i < result.standing.length ; i++) {
				soccerTable += generateFootballStandingsRows(result.standing[i]);
			}

			// End tbody and table
			soccerTable += '</tbody>';
			soccerTable += '</table>';

			$("#soccer_results").append(soccerTable);
			// Change the class, put in another one as you have to change the css for this
			$("#soccer_table").addClass("soccer_table");
			$("#soccer_table").removeClass("weather_table");
			console.log(soccerTable);

			console.log($("#results_heading").attr("id"));
		},
		failure: function(result) {
			console.log("Failure: ", result);
		}
	});
}

function getTeamInformation(team, filter) {
	//http://api.football-data.org/v1/teams/5/fixtures?timeFrame=n20
	$.ajax({
		url: "teams.json",
		//data: { input : league.toUpperCase()},
		//type: "POST",
		//dataType: "json",
		success: function(result) {
			console.log("Result:", result);
			var totalTeams = result.teams;
			for(var i = 0 ; i < totalTeams.length ; i++) {
				// var 
				if(totalTeams[i].name.toLowerCase().includes(team.toLowerCase())) {
					var team_id = totalTeams[i].id;
					var league_id = totalTeams[i].league.id;
					var team_code = totalTeams[i].code;
					var team_name_full = totalTeams[i].name;
					break;
				}
			}
			console.log(team_id, league_id, team_code,team_name_full);
			getTeamFixtures(team_id, league_id, team_code, team_name_full, filter);
		},
		failure: function(result) {
			console.log("Failure: ", result);
		}
	});
}


function getTeamFixtures(id, l_id, t_code, t_name, filter) {
	$.ajax({
		url: "get_teamfixtures.php",
		data: { t_id : id,
		        t_name: t_name,
		        l_code: l_id,
		        t_code: t_code,
		        filter: filter},
		type: "POST",
		dataType: "json",
		success: function(result) {
			console.log("Result:", result);

			$("#results_heading").attr('id', 'soccer_heading');
			$(".result_heading").html("Team Fixtures - " + t_name);
			$("#results").attr('id', 'soccer_results');
			var soccerTable = '<table class="table" id="soccer_table">';
			soccerTable += '<tbody>';

			// Start row for headings 
			soccerTable += '<tr>';
			// Generate headings 
			soccerTable += generateFixturesHeadingsHTML();
			// End row for headings
			soccerTable += '</tr>';
	
			// Generate data by looping through various teams
			for(var i = 0 ; i < result.fixtures.length ; i++) {
				soccerTable += generateFixturesRowsHTML(result.fixtures[i], i);
			}

			// End tbody and table
			soccerTable += '</tbody>';
			soccerTable += '</table>';
			$("#soccer_results").append(soccerTable);
			// Change the class, put in another one as you have to change the css for this
			$("#soccer_table").addClass("soccer_table");

		},
		failure: function(result) {
			console.log("Failure: ", result);
		}
	});
}



function returnWeatherRowStructure(id, heading, value, unit)
{
	var html = '<tr>';
	html += '<td class="weather_row_heading" id="'+id+'">' + heading + '</td>';
	html += '<td class="weather_row_value" id="'+id+'">' + value + ' ' + unit + '</td>';
	html += '</tr>';
	return html;
}      

function generateFootballStandingsHeadings() {
	// Columns are : position, team name, games played, wins, draws, losses, Goals For, Goals Against, Goal difference, points
	var html = '<td class="soccer_row_heading" id="soc_position">Pos</td>';
	html += '<td class="soccer_row_heading" id="soc_teamname">Team</td>';
	html += '<td class="soccer_row_heading" id="soc_gp">GP</td>';
	html += '<td class="soccer_row_heading" id="soc_wins">W</td>';
	html += '<td class="soccer_row_heading" id="soc_draws">D</td>';
	html += '<td class="soccer_row_heading" id="soc_losses">L</td>';
	html += '<td class="soccer_row_heading" id="soc_gf">GF</td>';
	html += '<td class="soccer_row_heading" id="soc_ga">GA</td>';
	html += '<td class="soccer_row_heading" id="soc_gd">GD</td>';
	html += '<td class="soccer_row_heading" id="soc_pts">Pts</td>';
	return html;
}

function generateFootballStandingsRows(res) {
	var html = '<tr>';
	html += '<td class="soccer_row_value" id="soc_position">'+res.position+'</td>';
	html += '<td class="soccer_row_value" id="soc_teamname">'+res.teamName+'</td>';
	html += '<td class="soccer_row_value" id="soc_gp">'+res.playedGames+'</td>';
	html += '<td class="soccer_row_value" id="soc_wins">'+res.wins+'</td>';
	html += '<td class="soccer_row_value" id="soc_draws">'+res.draws+'</td>';
	html += '<td class="soccer_row_value" id="soc_losses">'+res.losses+'</td>';
	html += '<td class="soccer_row_value" id="soc_gf">'+res.goals+'</td>';
	html += '<td class="soccer_row_value" id="soc_ga">'+res.goalsAgainst+'</td>';
	html += '<td class="soccer_row_value" id="soc_gd">'+res.goalDifference+'</td>';
	html += '<td class="soccer_row_value" id="soc_pts">'+res.points+'</td>';
	html += '</tr>';
	return html;
}

function generateFixturesHeadingsHTML() {
	// Columns are 
	//  #, Home Team, Score, Score, Away Team, Date, Status
	var html = '<td class="soccer_row_heading" id="ser_no">#</td>';
	html += '<td class="soccer_row_heading" id="home_team">Home Team</td>';
	html += '<td class="soccer_row_heading" id="score">Score</td>';
	html += '<td class="soccer_row_heading" id="away_team">Away Team</td>';
	html += '<td class="soccer_row_heading" id="date_played">Date</td>';
	html += '<td class="soccer_row_heading" id="status">Status</td>';
	return html;
}

function generateFixturesRowsHTML(res, serial_no) {
	
	var date = res.date.substr(0, res.date.indexOf("T"));
	if(res.status.toLowerCase() == "finished") {
		var score = res.result.goalsHomeTeam + " - " + res.result.goalsAwayTeam;
	}
	else {
		var score = "TBA - TBA";
	}
	var html = '<tr>';
	html += '<td class="soccer_row_value" id="ser_no">'+(parseInt(serial_no) + 1)+'</td>';
	html += '<td class="soccer_row_value" id="home_team">'+res.homeTeamName+'</td>';
	html += '<td class="soccer_row_value" id="score">'+score+'</td>';
	html += '<td class="soccer_row_value" id="away_team">'+res.awayTeamName+'</td>';
	html += '<td class="soccer_row_value" id="date_played">'+date+'</td>';
	html += '<td class="soccer_row_value" id="status">'+res.status+'</td>';
	html += '</tr>';
	return html;
} 


/*Clear on click*/
function clearHTML() {
	if($("#weather_heading").attr("id") == "weather_heading") {
		console.log("Cleared");
		$("#weather_table").remove();
		$(".weather_heading").html("");
		$(".weather_heading").addClass("result_heading");
		$(".weather_heading").removeClass("weather_heading");
		$("#weather_heading").attr("id", "results_heading");
	}
	if($("#soccer_heading").attr("id") == "soccer_heading") {
		$("#soccer_table").remove();
		$("#soccer_heading").attr("id","results_heading");
		$(".result_heading").html("");
	}
	if($("#weather_results").attr("id") == "weather_results") {
		console.log("Cleared");
		$("#weather_results").attr("id", "results");
	}
	if($("#soccer_results").attr("id") == "soccer_results"){
		$("#soccer_results").attr("id", "results");
	}
}

function availableCommands() {
	/*
	1. Weather
	    1.1 Weather for a city : Weather <City>
	    1.2 Weather for a country : Weather <Country>
	    1.3 Weather for a postal code: Weather <Postal Code>
	2. Soccer 
		2.1 Soccer table for league: Soccer table/standings <League Code>
			2.1.1 List of available leagues: league_ids.php
		2.2 Soccer Fixtures : Soccer Fixtures <Team name>
		2.3 Soccer Fixtures Upcoming/Previous : occer fixtures next/previous <num of days to go back or forward> <teamname>
		2.4 Live Soccer Scores : TBI
	3. Information
		3.1 Bring up wikipedia articles based on search : TBI
	4. Play Songs
		4.1 Play song: play <Song name>
		4.2 Play song with artist: play <Song name> by <Artist>
		4.3 Build Playlist of Songs: TBI
		4.4 Pause Song: TBI
	*/
}