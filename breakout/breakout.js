String.prototype.cssNumber = function() {
  return Number(this.slice(0, -2));
}
$(function() {
  var ballSize = 30;
  var row, col;
  for (row=0; row<10; row++) {
    for (col=0; col<10; col++) {
      $('#main').append('<div class="row' + row + ' col' + col + ' brick">');
    }
  }
  $('#main').append('<div id="paddle"></div>');
  $('#paddle').css('left', (800 - 140) / 2);

  $('#main').bind('mousemove', function(e) {
    var leftEdge = $(this).offset().left;
    var rightEdge = leftEdge + $(this).width();
    var halfPaddle = $('#paddle').width() / 2;
    var loc = e.clientX;
    if (loc >= rightEdge - halfPaddle) { loc = $('#main').width() - halfPaddle * 2; }
    else if (loc <= leftEdge + halfPaddle) { loc = 0; }
    else { loc = e.clientX - leftEdge - halfPaddle; }
    $('#paddle').css('left', loc);
  });

  $('#main').append('<div id="ball"></div>');

  // ball velocity
  var msPerFrame = 20;
  var secondsPerFrame = msPerFrame / 1000;

  // This sets horizontal rate to 200--600 pixels/second
  var vx = secondsPerFrame * (Math.floor(Math.random() * 400) + 200);
  if (Math.random() < 0.5) vx = -vx;

  // This sets verical rate to 500 pixels/second
  var vy = secondsPerFrame * 500;

  var moveBall = function() {

    var x = $('#ball').css('left').cssNumber() + vx;
    var y = $('#ball').css('top').cssNumber() + vy;
    if (x > $('#main').width() - ballSize || x <= 0) { vx = -vx; }
    if (y <= 0) { vy = -vy; }
    if (y > $('#main').height() - ballSize) {
      alert('You lost!');
      document.location.reload();
      return;
    }
    $('#ball').css('left', x);
    $('#ball').css('top', y);

    // check for collision
    var brickx = 80;  // dimensions of a brick
    var bricky = 20;
    var row = Math.floor((y - 100) / bricky);
    var col = Math.floor(x / brickx);

    if ($('.row' + row + '.col' + col).length > 0) {
      $('.row' + row + '.col' + col).remove();
      vy = -vy;
    }

    var paddle = {
      left: $('#paddle').css('left').cssNumber(),
      right: $('#paddle').css('left').cssNumber() + $('#paddle').width(),
      top: $('#paddle').css('top').cssNumber()
    }

    if (x >= paddle.left && x <= paddle.right && y >= paddle.top - 15) {
      vy = -Math.abs(vy);
    }

    if ($('.brick').length < 1) {
      alert('You won!');
      document.location.reload();
    } else {
      setTimeout(moveBall, 20);
    }

  }

  $('#ball').css('left', 385);
  $('#ball').css('top', 300);

  $('#main').one('click', function() {
    setTimeout(moveBall, 20);
  });

});
