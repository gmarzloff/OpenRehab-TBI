/* 	gcs.js 
* 	In this file we define data as objects to populate the Glasgow Coma Scale
*	created by George Marzloff | george@marzloffmedia.com
*/

var GCS_Scale = function () {

	this.name = "Glasgow Coma Scale";

	this.questions = [new Question(
					"Best Motor Response (max 6)",
					[
						new Choice("Obeys verbal commands",6),
						new Choice("Localizes pain, pushes away",5),
						new Choice("Withdraws from pain",4),
						new Choice("Decorticate posturing (flexion)",3),
						new Choice("Decorticate posturing (extension)",2),
						new Choice("None",1)
					]),

				new Question(
					"Best verbal response (max 5)",
					[
						new Choice("Alert and oriented",5),
						new Choice("Conversant but confused",4),
						new Choice("Inappropriate words",3),
						new Choice("Unintelligible sounds",2),
						new Choice("None",1)
					]),

				new Question(
					"Eye opening (max 4)",
					[
						new Choice("Spontaneously",4),
						new Choice("To (loud) voice",3),
						new Choice("To Pain",2),
						new Choice("None",1)
					])
	];

	this.userScores = [6,5,4]; // initializes array to keep track of score for each category.
}

var Question = function(title,choices){
		this.title = title;
		this.choices = choices;
};

Question.prototype.choiceFromScore = function(score){
	if(score != null){
		for(k=0; k<this.choices.length; k++){
			var c = this.choices[k];
			if(c.value == score){
				return c;
			}
		}
	}else{
		return {description: "error: score is null.", value: null};
	}
};

var Choice = function(desc,value){
	this.description = desc;
	this.value = value;
};


// Integer Array represents Fluency, Comprehension, Repetition
var aphasias = [
	[
		'Anomic',
		[true,true,true]
	],
	[
		'Conduction',
		[true, true, false]
	],
	[
		'Transcortical Sensory',
		[true,false,true]
	],
	[
		'Wernicke\'s',
		[true,false,false]
	],
	[
		'Transcortical motor',
		[false,true,true]
	],
	[
		'Broca\'s',
		[false,true,false]
	],
	[
		'Mixed transcortical',
		[false,false,true]
	],
	[
		'Global',
		[false,false,false]
	]
];

