$(document).ready(function() {

  var buf;
  var context = new AudioContext();

  function loadFile() {
      var req = new XMLHttpRequest();
      req.open("GET","../assets/beep.wav",true);
      req.responseType = "arraybuffer";
      req.onload = function() {
          context.decodeAudioData(req.response, function(buffer) {
              buf = buffer;
              play();
          });
      };
      req.send();
  }

  function play() {
    var src = context.createBufferSource();
    src.buffer = buf;
    src.connect(context.destination);
    //play immediately
    src.start(0);
  }

  for(i = 0; i < 16; i++) {
    $('#mainContainer').append('<div id="step' + i.toString() + '" class="step"></div>');
    $('.step').attr('data-trigger', false);
  }

  $('#play').on('mousedown', function() {
      loadFile();
    });
});
