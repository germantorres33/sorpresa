// data
const timeline = [
	{
		year: 1985,
		month: 09,
		month_name: "1er MES",
		title: "😃  Motivación a tope con grandes ganas de aprender"
	},
	{
		year: 1986,
		month: 06,
		month_name: "2do MES",
		title: "😥 Ingestas, Casos de Uso, Examen de Spark.... "
	},
	{
		year: 1988,
		month: 10,
		month_name: "3er MES",
		title: "😫 Ingestas, Casos de Uso, Examen de Desarrollo Seguro...."
	},
	{
		year: 1988,
		month: 10,
		month_name: "4to MES",
		title: "😱 Cierre de proyecto"
	},
	{
		year: 1990,
		month: 11,
		month_name: "5to MES",
		title: "😭 saturación de actividades"
	},
	{
		year: 1992,
		month: 10,
		month_name: "6to MES",
		title: "🤩 Finalización de desempeño a prueba"
	},
	{
		year: 1995,
		month: 08,
		month_name: "GRACIAS",
		title: "🥰🥰🥰🥰🥰🥰 Gracias por todo su apoyo incondicional, nos hacen sentir queridos e importantes ¡¡¡GRACIAS!!! 💓💓💓💓💓💓   atte. los Bluetabers "
	}
];

//
const mario = document.getElementById("mario");
const ground = document.getElementById("ground");
const grass = document.getElementById("grass");
const eventsContainer = document.getElementById("events");
let currentIndex = -1;
let currentPipe;
let int1;

// click handler
const pipeHandler = () => {
	clearInterval(int1);
	document.getElementById("info").style.display = "none";

	// clear old
	!currentPipe || currentPipe.classList.remove("active");

	// get index
	const index = parseInt(event.currentTarget.dataset.index);

	// walk
	const xpos = -100 - index * 150 - 25;
	const curXpos = -100 - currentIndex * 150 - 25;
	const distance = curXpos - xpos;
	const duration = Math.abs(distance) * 3;
	// console.log(distance);
	eventsContainer.style.transitionDuration = `${duration}ms`;
	eventsContainer.style.transform = `translateX(${xpos}px)`;
	ground.style.transitionDuration = `${duration}ms`;
	ground.style.backgroundPosition = `${xpos}px 32px`;
	grass.style.transitionDuration = `${duration}ms`;
	grass.style.backgroundPosition = `${xpos}px 0`;

	//
	playSfx("jump");

	// walk style
	const dir = distance < 0 ? "left" : "right";
	mario.classList.remove(
		"idle",
		"walk-left",
		"walk-right",
		"search-left",
		"search-right"
	);
	mario.classList.add(`walk-${dir}`);
	int1 = setTimeout(
		(dir, target) => {
			mario.classList.remove(`walk-${dir}`);
			mario.classList.add(`search-${dir}`);
			target.classList.add("active");
			playSfx("pipe");
		},
		duration,
		dir,
		event.currentTarget
	);

	// store position
	currentIndex = index;
	currentPipe = event.currentTarget;
};

// setup timeline
timeline.forEach((event, index) => {
	const e = document.createElement("div");
	e.classList.add("event");
	e.dataset.index = index;
	e.dataset.title = event.title;
	e.dataset.month = event.month_name;
	eventsContainer.appendChild(e);
	e.addEventListener("click", pipeHandler.bind(this));
});

/**
 * Audio handling
 */
const canAudio = "AudioContext" in window || "webkitAudioContext" in window;
const buffers = {};
let context = void 0;

if (canAudio) {
	var AudioContext = window.AudioContext || window.webkitAudioContext;
	context = new AudioContext(); // Make it crossbrowser
	var gainNode = context.createGain();
	gainNode.gain.value = 1; // set volume to 100%
}

const playSfx = function play(id) {
	if (!canAudio || !buffers.hasOwnProperty(id)) return;
	const buffer = buffers[id];
	const source = context.createBufferSource();
	source.buffer = buffer;
	source.connect(context.destination);
	source.start();
};

const loadBuffers = (urls, ids) => {
	if (typeof urls == "string") urls = [urls];
	if (typeof ids == "string") ids = [ids];
	urls.forEach((url, index) => {
		window
			.fetch(url)
			.then((response) => response.arrayBuffer())
			.then((arrayBuffer) =>
				context.decodeAudioData(
					arrayBuffer,
					(audioBuffer) => {
						buffers[ids[index]] = audioBuffer;
					},
					(error) => console.log(error)
				)
			);
	});
};

loadBuffers(
	[
		"https://assets.codepen.io/439000/jump.mp3",
		"https://assets.codepen.io/439000/smb_pipe.mp3"
	],
	["jump", "pipe"]
);