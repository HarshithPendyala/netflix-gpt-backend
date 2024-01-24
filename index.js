//express, cors, axiom, dotenv, nodemon
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

const port = process.env.PORT || 8080;

app.use(cors());

app.listen(port, () => {
	console.log("Sever is running at ", port);
});

const options = {
	method: "GET",
	headers: {
		accept: "application/json",
		Authorization: "Bearer " + `${process.env.REACT_APP_TMDB_KEY}`,
	},
};

app.get("/api/trailer/:query", (req, res) => {
	const url = `https://api.themoviedb.org/3/movie/${req.params.query}/videos?language=en-US`;

	fetch(url, options)
		.then((response) => response.json())
		.then((json) => {
			res.send(json);
		})
		.catch((err) => console.error("error:" + err));
});
app.get("/api/nowPlayingMovies", (req, res) => {
	const url =
		"https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1";
	fetch(url, options)
		.then((response) => response.json())
		.then((json) => res.send(json))
		.catch((err) => console.error("error:" + err));
});

app.get("/api/popularMovies", (req, res) => {
	const url =
		"https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=2";

	fetch(url, options)
		.then((response) => response.json())
		.then((json) => res.send(json))
		.catch((err) => console.error("error:" + err));
});
app.get("/api/topRatedMovies", (req, res) => {
	const url =
		"https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1";

	fetch(url, options)
		.then((response) => response.json())
		.then((json) => res.send(json))
		.catch((err) => console.error("error:" + err));
});
app.get("/api/upComingMovies", (req, res) => {
	const url =
		"https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1";
	fetch(url, options)
		.then((response) => response.json())
		.then((json) => res.send(json))
		.catch((err) => console.error("error:" + err));
});
app.get("/api/getMovieInfo/:query", (req, res) => {
	fetch(
		`https://api.themoviedb.org/3/movie/${req.params.query}?language=en-US`,
		options
	)
		.then((response) => response.json())
		.then((data) => res.send(data))
		.catch((err) => console.error(err));
});

//OPEN AI Integration and calls
const openai = new OpenAI({
	apiKey: process.env.REACT_APP_OPENAPI_KEY,
});

app.get("/api/gptSearch/:query", async (req, res) => {
	const gptQuery =
		"Act like a movie recommendation system. Suggest me 5 movies for this query:" +
		req.params.query +
		"give me results in tilde(~) separated values, example: Rocky~Mission Impossible:2~Crazy,Stupid,Love~Predator~Kind Kong";

	const chatCompletion = await openai.chat.completions.create({
		messages: [{ role: "user", content: gptQuery }],
		model: "gpt-3.5-turbo",
	});
	res.send(chatCompletion);
});

app.get("/api/gptMovies/:query", (req, res) => {
	fetch(
		`https://api.themoviedb.org/3/search/movie?query=${req.params.query}&include_adult=false&language=en-US&page=1`,
		options
	)
		.then((response) => response.json())
		.then((data) => res.send(data))
		.catch((err) => console.log("Error in fetching gpt movies: ", err));
});
