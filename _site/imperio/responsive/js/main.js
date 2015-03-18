$(document).ready(function() {

  // slider
  var onSlide = 1;
  var bullets = $('#slider #bullets ul li');
  var striveTypes = [
    'Awesome Possums',
    'Total Ballers',
    'Cool Cats',
    'Fine Fellas',
    'Rizzle Nizzles',
    'Hip Hipsters',
    'Busy Bees'
  ]
  bullets.click(function() {
    bullets.removeClass('selected');
    $(this).addClass('selected');
    var index = Number($(this).data('index'))
    $('#slides').css('margin-left', '' + index * -100 + '%');
    $('#strive-to-be').html(striveTypes[Math.floor(Math.random() * striveTypes.length)]);
    if (index === bullets.length - 1) {
      onSlide = 0;
    } else {
      onSlide = index + 1;
    }
  });

  function slide() {
    $(bullets.get(onSlide)).trigger('click');
  }

  setInterval(slide, 4000);

  // featured designs hover info click
  $('.hover_info a').click(function() {
    $('.modal').find('.modal-title').html($(this).parent().find('p').html());
    $('.modal').find('img').attr('src', 'images/slider' + $(this).data('image') + '.jpg');
    $('.modal').modal();
    return false;
  });

  // increment heart count
  $('.heart-icon').click(function() {
    var count = Number($(this).siblings('.like-count').text());
    $(this).siblings('.like-count').text(count + 1);
  });

  // testimonials slider
  $('ul.testimonial-slider-bullets li').click(function() {
    $('ul.testimonial-slider-bullets li').removeClass('selected');
    $(this).addClass('selected');
    var index = Number($(this).data('index'))
    $('.testimonial-names-container').css('margin-left', '' + index * -100 + '%');
    $('.testimonial-container').css('margin-left', '' + index * -100 + '%');
  })
});
