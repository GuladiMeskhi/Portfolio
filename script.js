/* Buger menu */
//Animation part 
let isMenuOpen = false;
const menuButton = document.querySelector('.menu-btn');

menuButton.addEventListener('click', () => {
	isMenuOpen = !isMenuOpen;

	if(isMenuOpen){
		menuButton.classList.add('open')
	}else {
		menuButton.classList.remove('open')
	}
})

const menu = document.querySelector('.primary-navbar__menu')
const burgerMenu = document.getElementById('burger-menu')
const logo = document.querySelector('.logo')
const space = document.querySelector('.space')
burgerMenu.addEventListener('click', () => {
    menu.classList.toggle('open-menu')
})

/* Visit count API */
const visitCount = document.getElementById('visits')

function visitsCount(response) {
    visitCount.innerText = response.value;
}

/* Lottie JSON animation */
let scrollAnimation = bodymovin.loadAnimation({
	container: document.getElementById('scroll-anim'),
	renderer: 'svg',
	loop: true,
	autoply:true,
	path: 'https://assets7.lottiefiles.com/packages/lf20_4pnrkf3w.json'
})

/* TicTacToe */
var origBoard;
const huPlayer = 'X';
const aiPlayer = 'O';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer)
		if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
}


function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}

/* OpenWeather API */

let weather = {
    apiKey: "3861861316ef407f1ab0c6abab37a421",
    // api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=3861861316ef407f1ab0c6abab37a421
    fetchWeather:function(lat,long){
        fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&APPID=" + this.apiKey + "&units=metric")
        .then((response)=>{
            if(!response.ok){
                alert("not found")
            }
            return response.json();
        })

        .then((data) => this.displayWeather(data))
    },
    displayWeather: function(data) {
        const { name,visibility } = data;
        const { country } = data.sys;
        const { feels_like,humidity,temp } = data.main;
        const { icon } = data.weather[0];
        const { speed } = data.wind;
        document.querySelector(".location").innerText = name + ", " + country;
        document.querySelector(".humidity").innerText = humidity + "%";
        document.querySelector(".visibility").innerText =  (visibility/1000).toFixed(1) + "km" ;
        document.querySelector(".feels-like").innerText = feels_like + "°C";
        document.querySelector(".wind-speed").innerText = speed + "km/h";
        document.querySelector(".temperature").innerText = temp + "°C";
        document.querySelector(".icons").src = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
    },
}

/* Geolocation API to get your current city for weather */
if('geolocation' in navigator) {
	navigator.geolocation.getCurrentPosition(function(position){
		let lat = position.coords.latitude;
		let long = position.coords.longitude;
		weather.fetchWeather(lat,long)
		console.log(lat,long)
	})
  } else {
		alert("please allow access to your Geolocation to get Weather information")
}

/* SwiperJS */

 
var swiper = new Swiper(".slide-content", {
    slidesPerView: 3,
    spaceBetween: 25,
    loop: true,
    centerSlide: 'true',
    fade: 'true',
    grabCursor: 'true',
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    breakpoints:{
        0: {
            slidesPerView: 1,
        },
        520: {
            slidesPerView: 2,
        },
        950: {
            slidesPerView: 3,
        },
    },
  });
