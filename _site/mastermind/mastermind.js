var mastermind = function() {
  _this = this;
  this.sequence = ''
  this.correctLetters = 0;
  this.fullyCorrect = 0;
  this.guesses = 0;
  this.sequence_array = [];
  this.generateSequence = function() {
    var letters = 'abcdef';
    for (var i=0; i<4; i++) {
      _this.sequence += letters[Math.floor(Math.random() * 6)];
    }
    console.log(_this.sequence);
    _this.sequence_array = _this.sequence.split('');
  }

  this.solve = function() {
    _this.guesses += 1;
    _this.correctLetters = _this.fullyCorrect = 0;
    var inputs = document.getElementsByTagName('input');
    for (var i=0; i<inputs.length-1; i++) {
      var v = inputs[i].value;
      if (v.length > 0 && _this.sequence.indexOf(v) > -1 && _this.sequence_array.indexOf(v) > -1) {
        _this.correctLetters += 1;
        document.getElementById('correctletters').innerHTML = _this.correctLetters;
        _this.sequence_array.pop(v);
        if (_this.sequence[i] == v) {
          _this.fullyCorrect += 1;
          document.getElementById('fullycorrect').innerHTML = _this.fullyCorrect;
        }
      }
    }
    document.getElementById('guessessofar').innerHTML = _this.guesses;
    if (_this.fullyCorrect === 4) {
      alert("You guessed it in " + _this.guesses + "guesses!");
      document.location.reload();
    }
    return false;
  }

  this.init = function() {
    var form = document.getElementById('gameform');
    form.onsubmit = _this.solve;
  }
}

var m = new mastermind();
m.generateSequence();
m.init();