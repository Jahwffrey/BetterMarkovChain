//Setup variables. I will be modelling this as a kind of n-dimensional array for words containing other words. At word depth
//is an array of words that will be used as the next set of indexes to use:
//0->0->0->['Hello','Whats']
//0->0->'Hello'->['my','son!'] and so forth
var wordDepth = 4;
var wordMap = {};
var randNum = Math.random();
var notAWord = randNum.toString();
var wordMem = [];
for(var i = 0;i < wordDepth;i++){
	wordMem[i] = notAWord;
}

wordMap[notAWord] = {};
//Setup the base wordmap with a wordDepth of notAWord's
var whichThing = wordMap[notAWord];

for(var i = 1;i < wordDepth - 1;i++){
	whichThing[notAWord] = {};
	whichThing = whichThing[notAWord];
}
whichThing[notAWord] = [];

//push a word to the back of an array and lose the front
var cycleArray = function(arr,item){
	for(var i = 0;i < arr.length-1;i++){
		arr[i] = arr[i+1];
	}
	arr[arr.length-1] = item;
}

var addToWordMap = function(str){
	for(var i = 0;i < wordDepth;i++){
		wordMem[i] = notAWord;
	}
	var testArr = str.split(" ");
	for(var i = 0;i < testArr.length;i++){
		//Walk down the wordMap, created new routes
		if(wordMap[wordMem[0]] == undefined){
			wordMap[wordMem[0]] = {};
		}
		whichThing = wordMap[wordMem[0]];
		for(var ii = 1;ii < wordDepth;ii++){
			if(whichThing[wordMem[ii]] == undefined){
				if(ii == wordDepth-1){
					whichThing[wordMem[ii]] = [];
				} else {
					whichThing[wordMem[ii]] = {};
				}
			}
			whichThing = whichThing[wordMem[ii]];
		}
		whichThing.push(testArr[i]);
		cycleArray(wordMem,testArr[i]);
	}
}

var generateASentence = function(endConditionsFunction,wordList){
	var sentence = "";
	for(var i = 0;i < wordDepth;i++){
		wordMem[i] = wordList[i];
		if(wordList[i]!=notAWord) sentence = sentence + wordList[i] + " ";
	}
	var lastStr = notAWord;
	var lookThing;
	while(endConditionsFunction(lastStr)){
		lookThing = wordMap[wordMem[0]];
		for(var i = 1;i < wordDepth;i++){
			if(wordMem[i]!=undefined){
				lookThing = lookThing[wordMem[i]];
			}
		}
		lastStr = lookThing[Math.floor(Math.random()*lookThing.length)];
		cycleArray(wordMem,lastStr);
		sentence = sentence + lastStr + " ";
	}
	console.log(sentence);
}
$(document).ready(function(){
	var testStr = $("#hobbit").text();
	var sentenceArr = testStr.split(".");
	for(var i = 0;i < sentenceArr.length;i++){
		addToWordMap(sentenceArr[i] + ".");
	}
	generateASentence(function(str){
		var strArr = str.split("");
		var lastSymbol = strArr[strArr.length - 1];
		if(lastSymbol == "." || lastSymbol == "?" || lastSymbol == "!" || lastSymbol == '.\n' || lastSymbol == '?\n' || lastSymbol == '!\n'){
			return false;
		} else {
			return true;
		}
	},[notAWord,notAWord,notAWord]);
});