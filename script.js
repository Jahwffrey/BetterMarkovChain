//Setup variables. I will be modelling this as a kind of n-dimensional array for words containing other words. At word depth
//is an array of words that will be used as the next set of indexes to use:
//0->0->0->['Hello','Whats']
//0->0->'Hello'->['my','son!'] and so forth
var wordDepth = 3;
var wordMap = {};
var randNum = Math.random();
var notAWord = randNum.toString();
var wordMem = [];
var startWords = [notAWord];
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

//Split function in the from array function(str){};
//Start word check function in the form boolean function(word,sentence){};
var addToWordMap = function(str,splitFunction,startWordCheckFunction){
	for(var i = 0;i < wordDepth;i++){
		wordMem[i] = notAWord;
	}
	var testArr = splitFunction(str);
	for(var i = 0;i < testArr.length;i++){
		//Walk down the wordMap, created new routes
		if(startWordCheckFunction(testArr[i],str)){
			startWords.push(testArr[i]);
		}
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

//End condition function in the form boolean function(word){};
var generateASentence = function(endConditionsFunction,wordList,wordSeperator){
	var sentence = "";
	if(wordList!=-1){
		for(var i = 0;i < wordDepth;i++){
			wordMem[i] = wordList[i];
			if(wordList[i]!=notAWord) sentence = sentence + wordList[i] + wordSeperator;
		} 
	} else {
		for(var i = 0;i < wordDepth;i++){
			wordMem[i]=notAWord;
		}
		var startWord = startWords[Math.floor(Math.random()*startWords.length)];
		cycleArray(wordMem,startWord);
		sentence = sentence + startWord + wordSeperator;
		var thisWord = wordMap[startWord];
		for(var i = 1;i < wordDepth;i++){
			var words = Object.keys(thisWord);
			startWord = words[Math.floor(Math.random()*words.length)];
			sentence = sentence + startWord + wordSeperator;
			thisWord = thisWord[startWord];
			cycleArray(wordMem,startWord);
		}
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
		sentence = sentence + lastStr + wordSeperator;
	}
	console.log(sentence);
}




$(document).ready(function(){
	var testStr = $("#wordDiv").text();
	addToWordMap(testStr,function(str){return str.split(" ");},function(str,sentence){
		return str.match(/[A-Z].*/) == str;
	});
	generateASentence(function(str){
		var strArr = str.split("");
		var lastSymbol = strArr[strArr.length - 1];
		if(lastSymbol == "." || lastSymbol == "?" || lastSymbol == "!" || lastSymbol == '.\n' || lastSymbol == '?\n' || lastSymbol == '!\n'){
			return false;
		} else {
			return true;
		}
	},-1," ");
});