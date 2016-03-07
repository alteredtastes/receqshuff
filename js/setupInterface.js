$(document).ready(function() {

  function metronome() {
    var now = context.currentTime;
    var beat = (1000*60)/($("#bpm").val());
  }

  $('body').append('<div id="mainControls"></div>');
  $('#mainControls').append('<label class="bpmCntrl" for="bpm">bpm:<input type="number" id="bpm" class="bpmCntrl" name="bpm" value="120" min="0" max="500"/></label>');

  for(i = 0; i < 16; i++) {
    $('#mainContainer').append('<div id="step' + i.toString() + '" class="step"></div>');
    $('.step').attr('data-trigger', false);
  }

  if((now % beat) === 0) {
    $('.step').toggleClass('trigger');
  }

});
