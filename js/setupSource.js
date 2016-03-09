$(document).ready(function() {

  var buf, i;
  var $bpm = $('#bpm').val();
  var context = new AudioContext();
  var time = context.currentTime + 1;

  function updateBpm(value) {
  $bpm = value;
  }

  function loadFile(file, planned) {
      var req = new XMLHttpRequest();
      req.open("GET","../assets/" + file + ".wav",true);
      req.responseType = "arraybuffer";
      req.onload = function() {
          context.decodeAudioData(req.response, function(buffer) {
              buf = buffer;
              play(planned);
          });
      };
      req.send();
  }

  function play(planned) {
    var src = context.createBufferSource();
    src.buffer = buf;
    src.connect(context.destination);
    src.start(planned);
  }

  function schedule() {
    var quarter = ((60*1000)/$bpm)/1000;
    var eighth = quarter/2;
    console.log(eighth);
    for (i = 0; i < 16; i++){
      var increment = (i * eighth);
      loadFile("beep", time + increment);
    }
  }

  for(i = 0; i < 16; i++) {
    $('#mainContainer').append('<div id="step' + i.toString() + '" class="step"></div>');
    $('.step').attr('data-trigger', false);
  }

  $(window).keyup(function (e) {
  if (e.keyCode === 0 || e.keyCode === 32) {
    e.preventDefault()
    schedule();
  }
})

  $('#bpm:input').on('mousedown', function() {
      updateBpm($('#bpm').val());
    });
});
