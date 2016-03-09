$(document).ready(function() {

  for(i = 0; i < 16; i++) {
    $('#mainContainer').append('<div id="step' + i.toString() + '" class="step"></div>');
    $('.step').attr('data-trigger', false);
  }

  $('#play').on('click', function() {
      playSound();
    });
});
