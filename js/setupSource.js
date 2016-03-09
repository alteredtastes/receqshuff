$(document).ready(function() {

  var buf, bpm, i;
  var context = new AudioContext();
  var time = context.currentTime + 1;

  function loadFile(file, planned) {
      var req = new XMLHttpRequest();
      req.open("GET","../assets/" + file + ".wav", true);
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

  function triggerOn(i, increment) {
    setTimeout(function() {
      $('#step' + i.toString()).addClass('trigger');
    }, (increment * 1000));
  }

  function triggerOff(i, increment, eighth) {
    setTimeout(function() {
      $('#step' + i.toString()).removeClass('trigger');
    }, ((increment + eighth) * 1000));
  }

  function schedule() {
    var quarter = ((60*1000)/bpm)/1000;
    var eighth = quarter/2;
    console.log(eighth);
    for (i = 0; i < 16; i++){
      var increment = (i * eighth);
      loadFile("beep", time + increment);
      triggerOn(i, increment);
      triggerOff(i, increment, eighth);
    }
  }

  for(i = 0; i < 16; i++) {
    $('#mainContainer').append('<div id="step' + i.toString() + '" class="step"></div>');
    $('.step').attr('data-trigger', false);
  }

  $(window).keyup(function (e) {
  if (e.keyCode === 0 || e.keyCode === 32) {
    e.preventDefault()
    bpm = $('#bpm').val();
    time = context.currentTime + 1;
    schedule();
    }
  })

});
