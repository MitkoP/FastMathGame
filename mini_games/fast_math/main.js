var game = new Phaser.Game(1024, 672, Phaser.AUTO, 'Fast math', {create: create, preload: preload, update: update, render: render});

//vars
var rand_number = 0;
var num1 = [];
var multiply = 0;
var answer = 0;
var opit = '';
var buff = 0;
var score = 0;
var types = ['take','sum','multy','dev'];
var level = 3;
var check;
var stage = 2;
var steps;
var groupC;

//sprites
var bg;
var numbers = [];
var sprites = [];
var answers = [];
var gate1;
var gate2;
var tweenA;
var tweenB;
var sighn;
var symbol;
var cir1;
var cir2;
var ret;
var timeS;


//time vars
var StartTime = 0;
var StartTime2 = 0;
var CurTime = 0;
var time = 0;

// text vars
var random_number;
var multiply_number;
var tries_text;
var score_text;




function preload() {
	game.load.image('bg','assets/fast_math/bg.jpg');

	for(i = 0; i < 10; i++ ){
		game.load.image(i+'', 'assets/fast_math/'+ i + '.png');
	}
	game.load.image('gate', 'assets/fast_math/gate.png');
	game.load.image('multy', 'assets/fast_math/multy.png');
	game.load.image('take', 'assets/fast_math/take.png');
	game.load.image('sum', 'assets/fast_math/sum.png');
	game.load.image('dev', 'assets/fast_math/dev.png');
	game.load.image('cir1', 'assets/fast_math/Circle1.png');
	game.load.image('cir2', 'assets/fast_math/Circle2.png');
	game.load.image('return', 'assets/fast_math/return.png');
	game.load.spritesheet('timeS', 'assets/fast_math/time.png', 188, 188, 12);
}

function create(){
	game.stage.backgroundColor = 0xffffff;
	var style = { font: "20px Arial", fill: "#ffffff", align: "center" };
	get_equation();

	bg = game.add.sprite(0, 0, 'bg');
	bg.width = 1024;
	bg.height = 672;
	

	gate1 = game.add.sprite(0, game.world.height/2, 'gate');
	gate1.anchor.y = 1;
	gate2 = game.add.sprite(0, game.world.height/2, 'gate');

	timeS = game.add.sprite(game.world.centerX, game.world.centerX, 'timeS');
	timeS.anchor.setTo(0.5, 0.5);
	timeS.animations.add('full', [0,1,2,3,4,5,6,7,8,9,10,11],12 ,true, true);
	timeS.animations.play('full', 20, true);

	groupC = game.add.group();
	cir2 = game.add.sprite(game.world.centerX, game.world.centerY + 15, 'cir2');
	cir2.anchor.setTo(0.5, 0.5);
	cir2.width = 250;
	cir2.height = 250;
	groupC.add(cir2);
	
	cir1 = game.add.sprite(game.world.centerX, game.world.centerY + 15, 'cir1');
	cir1.anchor.setTo(0.5, 0.5);
	cir1.width = 180;
	cir1.height = 180;
	groupC.add(cir1);

	ret = game.add.sprite(10,10,'return');
	ret.anchor.setTo(0.5, 0.5);
	ret.width = 50;
	ret.height = 50;
	ret.x = 440;
	ret.y = 274;
	ret.angle -= 30;
	ret.inputEnabled = true;
	ret.events.onInputDown.add(recover, this);

	setExam();
	setNumbers();

	steps = 200 / stage;
	StartTime = game.time.totalElapsedSeconds();
	StartTime2 = game.time.totalElapsedSeconds();
}

function update() {
	checkAnswer();
}

function render() {
	game.debug.text('X cordinates: ' + game.input.mousePointer.x, 10, 30);
	game.debug.text('Y cordinates: ' + game.input.mousePointer.y, 10, 50);
	game.debug.text('Answer: ' + answer, 10, 70);
	game.debug.text('Stage: ' + stage, 10, 90);
	game.debug.text('Score: ' + score, 10, 110);
}

function reset() {
	console.log("Restarting ...");
	StartTime = game.time.totalElapsedSeconds();
	StartTime2 = game.time.totalElapsedSeconds();
	deleteNumbers();
	if(stage == 0){	
		hideNumbers();
		spr.destroy();
		ret.visible = false;
		tweenA = game.add.tween(gate1).to({y : 0}, 2000,  Phaser.Easing.Bounce.Out, true, 0);
		tweenB = game.add.tween(gate2).to({y : game.world.height}, 2000,  Phaser.Easing.Bounce.Out, true, 0);
		game.add.tween(groupC).to({x: 1200, y : 500}, 30000,  Phaser.Easing.Bounce.Out, true, 0);
	}else{
		opit = "";
		check = "";
		spr.destroy();
		get_equation();
		setExam();
	}
	

}

function checkAnswer(){
	if(parseInt(check) == answer){
		console.log("Right ANSWER");
		stage--;
		tweenA = game.add.tween(gate1).to({y : (gate1.y - steps)}, 2000,  Phaser.Easing.Bounce.Out, true, 0);
		tweenA.onComplete.add(reset,this);
		tweenB = game.add.tween(gate2).to({y : (gate2.y + steps)}, 2000,  Phaser.Easing.Bounce.Out, true, 0);
		check = "";
		score += 20;
	}
}

function hideNumbers(){
	for(i = 0; i < 10; i++){
		numbers[i].visible = false;
	}
}

function setNumbers(){
	for(i = 0; i < 10; i++){
		numbers[i] = game.add.sprite(10 + i*64, 20, i+'');
		numbers[i].anchor.setTo(0.5, 0.5);
		numbers[i].width = 31;
		numbers[i].height = 44;
		numbers[i].inputEnabled = true;
		numbers[i].events.onInputDown.add(onDown, this);
	}

	numbers[0].x = game.world.centerX;
	numbers[0].y = game.world.centerY - 90;
	console.log('Number WxH: ' + numbers[0].width+'x'+numbers[0].height);

	numbers[1].x = game.world.centerX + 45;
	numbers[1].y = game.world.centerY - 80;
	numbers[1].angle += 30;

	numbers[2].x = 593;
	numbers[2].y = 286;
	numbers[2].angle += 45;

	numbers[3].x = 616;
	numbers[3].y = 337;
	numbers[3].angle += 90;

	numbers[4].x = 604;
	numbers[4].y = 396;
	numbers[4].angle += 120;

	numbers[5].x = 567;
	numbers[5].y = 439;
	numbers[5].angle += 145;

	numbers[6].x = 513;
	numbers[6].y = 452;
	numbers[6].angle += 180;

	numbers[7].x = 453;
	numbers[7].y = 436;
	numbers[7].angle += 210;

	numbers[8].x = 417;
	numbers[8].y = 390;
	numbers[8].angle += 250;

	numbers[9].x = 410;
	numbers[9].y = 339;
	numbers[9].angle += 270;

}

function onDown(sprite){
	if(opit.length < 3){
		opit += sprite.key;
		len = opit.length;
		x = game.world.width/2 + 22;
		y = game.world.height/2 - 22;
		setNumber(opit[len-1],x - (len-1)*22, y + 80)
	}
	check = reverseString(opit);
	console.log(check);
}

function recover(){
	if(opit.length >0){
		opit = opit.substring(0, opit.length-1)
		len = opit.length;

		sprites[sprites.length-1].destroy();
		sprites.pop();
	}
}

function get_equation() {
	var rangeBegin;
	var rangeEnd;
	 if(level == 1){
	 	//stage = 3;
	 	exam = types[game.rnd.integerInRange(0,1)];
	 	symbol = exam;
	 	if(exam == 'take'){
	 		rand_number = game.rnd.integerInRange(99,999);
	 		while(true){
	 			multiply = game.rnd.integerInRange(40,999)
	 			if(multiply < rand_number){
	 				break;
	 			}
	 		}
	 		answer = rand_number - multiply;
	 	}
	 	else{
	 		rand_number = game.rnd.integerInRange(99,999);
	 		while(true){
				multiply = game.rnd.integerInRange(40,999);
				if ((rand_number + multiply) < 1000){
					answer = rand_number + multiply;
					break;
				}
			}
	 	}
	 }
	 else if(level == 2){
	 	//stage = 4;
	 	exam = types[game.rnd.integerInRange(2,3)];
	 	symbol = exam;
	 	console.log('Choise is : ' + exam)
	 	if(exam == 'multy'){
	 		rand_number = game.rnd.integerInRange(20,500);
	 		while(true){
	 			multiply = game.rnd.integerInRange(2,10);
	 			if(multiply * rand_number < 999){
	 				answer = rand_number * multiply;
	 				break;
	 			}
	 		}
	 	}
	 	else{
	 		while(true){
	 			rand_number = game.rnd.integerInRange(20,999);
	 			multiply = game.rnd.integerInRange(2,10);
	 			if((rand_number / multiply)%2 == 0){

	 				answer = rand_number / multiply;
	 				break;
	 			}
	 		}
	 	}
	 }
	 else if(level == 3){
	 	//stage = 5;
	 	exam = types[game.rnd.integerInRange(0,3)];
	 	symbol = exam;

	 		if(exam == 'take'){
	 		rand_number = game.rnd.integerInRange(99,999);
	 		while(true){
	 			multiply = game.rnd.integerInRange(40,999)
	 			if(multiply < rand_number){
	 				answer = rand_number - multiply;
	 				break;
	 			}
	 		}
	 	}
	 	else if(exam == 'sum'){
	 		rand_number = game.rnd.integerInRange(99,999);
	 		while(true){
				multiply = game.rnd.integerInRange(40,999);
				if ((rand_number + multiply) < 1000){
					answer = rand_number + multiply;
					break;
				}
			}
	 	}
	 	else if(exam == 'multy'){
	 		rand_number = game.rnd.integerInRange(20,500);
	 		while(true){
	 			multiply = game.rnd.integerInRange(2,10);
	 			if(multiply * rand_number < 999){
	 				answer = rand_number * multiply;
	 				break;
	 			}
	 		}
	 	}
	 	else if(exam == 'dev'){
	 		while(true){
	 			rand_number = game.rnd.integerInRange(20,999);
	 			multiply = game.rnd.integerInRange(2,10);
	 			if((rand_number / multiply)%2 == 0){
	 				answer = rand_number / multiply;
	 				break;
	 			}
	 		}
	 	}
	 }
	 console.log('Answer is : ' + answer);
}

function setExam(){
	tmp = numArray(rand_number);
	len = tmp.length;
	x = game.world.width/2;
	y = game.world.height/2 - 22;
	if(len > 2){
		x -=22
	}
	for(i = 0; i < tmp.length; i++){
		setNumber(tmp[i], x + i*22, y);
	}

	tmp = numArray(multiply);
	len = tmp.length;
	x = game.world.width/2;
	y = game.world.height/2 - 22;
	if(len > 2){
		x -=22
	}
	else if(len == 1)
	{
		x += 22;
	}
	for(i = 0; i < tmp.length; i++){
		setNumber(tmp[i], x + i*22, y + 40);
	}

	spr = game.add.sprite(game.world.width/2 - 55,game.world.height/2,symbol);
	spr.width = 30;
	spr.height = 30;
	spr.anchor.setTo(0.5, 0.5);
}

function numArray(num) {	
	length = num.toString().length;
	str = num.toString()
	tmp = [];
	for(i = 0; i < length; i++){
		tmp[i] = str[i];
	}
	return tmp;
}


// sets number on spec. location
function setNumber (num, x, y){
	sprites[sprites.length] = game.add.sprite(x, y, num+'');
	sprites[sprites.length - 1].anchor.setTo(0.5, 0.5);
	sprites[sprites.length - 1].width = 31;
	sprites[sprites.length - 1].height = 44;
}

function deleteNumbers(){
	for(i = 0; i < sprites.length; i++){
		sprites[i].destroy();
	}
	while(sprites.length > 0){
		sprites.pop();
	}
}

function reverseString(str) {
    return str.split('').reverse().join('');
}

function Gameover(){
	CurTime = game.time.totalElapsedSeconds();
	deleteNumbers();
	// send score to DB the name of the var is score
}