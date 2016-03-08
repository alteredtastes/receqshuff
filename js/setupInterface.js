$(document).ready(function() {

  $('body').append('<div id="mainControls"></div>');
  $('#mainControls').append('<label class="bpmCntrl" for="bpm">bpm:<input type="number" id="bpm" class="bpmCntrl" name="bpm" value="120" min="0" max="500"/></label>');
  $('#mainControls').append('<button id="play" name="play">Play</button>');


  for(i = 0; i < 16; i++) {
    $('#mainContainer').append('<div id="step' + i.toString() + '" class="step"></div>');
    $('.step').attr('data-trigger', false);
  }

});
