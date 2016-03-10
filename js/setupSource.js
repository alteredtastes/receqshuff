$(document).ready(function() {

  var buf, bpm, spaceup, i;
  var vcos = []; //'voltage controlled oscillators'
  var vcas = []; //'voltage controlled amplifiers'
  var stepsEnabled = [];
  var context = new AudioContext();
  var time = context.currentTime + 1;

  function attack(j, planned) {
    vcas[j].gain.cancelScheduledValues(planned);
    vcas[j].gain.setValueAtTime(vcas[j].gain.value, planned);
    vcas[j].gain.linearRampToValueAtTime(1, planned + 0.1);
  }

  function release(j, planned) {
    vcas[j].gain.cancelScheduledValues(planned);
    vcas[j].gain.setValueAtTime(vcas[j].gain.value, planned);
    vcas[j].gain.linearRampToValueAtTime(0, planned + 0.6);
  }

  function playSynth(planned, increment){
    for(j = 0; j < 16; j++) {
      vcos[j] = context.createOscillator();
      vcas[j] = context.createGain();
      vcos[j].connect(vcas[j]);
      vcas[j].connect(context.destination);
      vcos[j].frequency = 440;
      vcas[j].gain.value = 0.02;
      vcos[j].start(planned);
      attack(j, planned);
      release(j, planned);
    }
  }

  function loadFile(file, planned) {
    var req = new XMLHttpRequest();
    req.open("GET","../assets/" + file + ".wav", true);
    req.responseType = "arraybuffer";
    req.onload = function() {
        context.decodeAudioData(req.response, function(buffer) {
            buf = buffer;
            playFile(planned);
        });
    };
    req.send();
  }

  function playFile(planned) {
    var src = context.createBufferSource();
    src.buffer = buf;
    src.connect(context.destination);
    src.start(planned);
  }

  function triggerOn(i, increment) {
    setTimeout(function() {
      $('#step' + i.toString()).addClass('trigger');
    }, ((increment + 1) * 1000));
  }

  function triggerOff(i, increment, eighth) {
    setTimeout(function() {
      $('#step' + i.toString()).removeClass('trigger');
    }, ((increment + eighth + 1) * 1000));
  }

  function schedule() {
    var quarter = ((60*1000)/bpm)/1000;
    var eighth = quarter/2;
    console.log(eighth);
    for (i = 0; i < 16; i++){
      var increment = (i * eighth);
      // if(stepsEnabled[i] == true) {
        if($('#sample:checked').val()) {
          loadFile("beep", time + increment);
        }else if($('#synth:checked').val()) {
          playSynth(time + increment, increment);
        }
      // }
      triggerOn(i, increment);
      triggerOff(i, increment, eighth);
      }
    }

  for(i = 0; i < 16; i++) {
    $('#mainContainer').append('<div id="step' + i.toString() + '" class="step"></div>');
    $('.step').attr('data-trigger', false);
  }

  $(window).keyup(function(e) {
    if (e.keyCode === 0 || e.keyCode === 32) {
      e.preventDefault();
      $('#playButton').removeClass('activate');
      bpm = $('#bpm').val();
      time = context.currentTime + 1;
      schedule();
    }
  })

  $(window).keydown(function(e) {
    if (e.keyCode === 0 || e.keyCode === 32) {
      e.preventDefault();
      $('#playButton').addClass('activate');
      }
    })

  for(i = 0; i < 16; i++) {
    $('#step' + i.toString()).on('click', function() {
      $('.step').removeClass('stepSelected');
      $(this).toggleClass('stepSelected');
    })
    $('#step' + i.toString()).on('dblclick', function() {
      $(this).toggleClass('stepOn');
      if(stepsEnabled[i] == false || stepsEnabled[i] == undefined) {
        stepsEnabled[i] = true;
      }else if(stepsEnabled[i] == true){
        stepsEnabled[i] = false;
      }
    })
  }

  $('#mode').on('click', function() {
    if($(this).val() == 'design') {
      $(this).val('compose');
    }else if($(this).val() == 'compose') {
      $(this).val('design');
    }
  });

});
