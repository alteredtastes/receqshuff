$(document).ready(function() {

  var buf, bpm, spaceup, designOn, stepFocused, i;
  var vcos = []; //'voltage controlled oscillators'
  var vcas = []; //'voltage controlled amplifiers'
  var steps = [];
  var synthSettings = [];
  var context = new AudioContext();
  var time = context.currentTime + 1;

  function StepId (stepNum, focused, stepSource, pitch, octave, waveType, attackTime, releaseTime, file) {
    this.stepNum = stepNum;
    this.focused = focused;
    this.stepSource = stepSource;
    this.pitch = pitch;
    this.octave = octave;
    this.waveType = waveType;
    this.attackTime = attackTime;
    this.releaseTime = releaseTime;
    this.file = file;
  }

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
    var loop = $('#loopCntrl').val();

    for (i = 0; i < (16*loop); i++){
      var increment = (i * eighth);
        if ($('#sample:checked').val()) {
          loadFile("beep", time + increment);
        } else if ( $('#synth:checked').val() ) {
          playSynth(time + increment, increment);
        }
      triggerOn(i, increment);
      triggerOff(i, increment, eighth);
    }
  }

  function createWave (divClass, file) {
    var wavesurfer = WaveSurfer.create({
    container: step,
    barWidth: 0.4,
    normalize: true,
    height: 175,
    waveColor: 'black',
    progressColor: 'purple'
    });
    wavesurfer.load(file);
    return wavesurfer;
    }

    $('body').append('<div id="controlPanelRight" class="cpanel"></div>');
    $('body').append('<div id="controlPanelBottom" class="cpanel"></div>');
    $('.cpanel').hide();

  for(i = 0; i < 16; i++) {
    $('#mainContainer').append('<div id="step' + i.toString() + '" class="step"></div>');
    $('#controlPanelRight').append('<div id="step' + i.toString() + 'synthCntrl"></div>');
    $('#controlPanelRight').append('<div id="step' + i.toString() + 'sampleCntrl"></div>');
    $('#controlPanelRight').append('<div id="step' + i.toString() + 'micCntrl"></div>');
    $('#step' + i.toString() + 'synthCntrl').hide();
    $('#step' + i.toString() + 'sampleCntrl').hide();
    $('#step' + i.toString() + 'micCntrl').hide();
  }

  // <label class="srcType" for="srcType">step source: <input type="radio" id="mic" class="srcType" name="srcType" value="mic"/>mic
  // <input type="radio" id="sample" class="srcType" name="srcType" value="sample"/>sample
  // <input type="radio" id="synth" class="srcType" name="srcType" value="synth" checked/>synth</label>

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
    var stepNum = i;
    var focused = false;
    var stepSource = $('#synth').val();
    var pitch = 440;
    var octave = 4;
    var waveType = 'triangle';
    var attackTime = 0.01;
    var releaseTime = 0.6;
    var file = 'beep';
    steps[i] = new StepId (i, stepSource, pitch, octave, waveType, attackTime, releaseTime, file);
  };

  for(i = 0; i < 16; i++) {
    $('#step' + i.toString()).on('click', function(e) {
      $('.step').removeClass('stepSelected');
      $(this).toggleClass('stepSelected');
      $('.cpanel').fadeIn(700);
;    })
    $('#step' + i.toString()).on('dblclick', function(e) {
      $(this).toggleClass('stepOn');
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
