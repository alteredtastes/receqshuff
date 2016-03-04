$(document).ready(function() {

  var createWave = function(divClass, file) {
    var wavesurfer = WaveSurfer.create({
    container: divClass,
    barWidth: 1,
    normalize: true,
    height: 150,
    waveColor: 'black',
    progressColor: 'purple'
    });
    wavesurfer.load(file);
    return wavesurfer;
    }

  $('.draggable').draggable({
    revert: true,
    revertDuration: 0,
    snap: true,
    stack: '.droppable'
  });

  $('.droppable').droppable({
    drop: function(event, ui) {
      var dragged = ui.draggable.html();
      $(this).html(dragged);
    }
  });

  createWave("#num0", "myRecording01.wav");
  createWave("#num1", "study-room-sound.wav");
  createWave("#num2", "study-room-sound2.wav");

  // for(var i = 0; i < 16; i++) {
  // createWave("#num" + i.toString(), "myRecording01.wav");
  // }



  // function metronomeTick() {
  //   $("#metronome").toggle();
  // }
  // setTimeout('metronomeTick', 60);
});
