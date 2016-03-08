$(document).ready(function() {
  var context = new AudioContext();
  var out = context.destination;
  var sources = [];
  var vcos = [];
  var vcas = [];
  var i;
  var now;
  var beat;

  // function metronome() {
  //   now = context.currentTime;
  //   beat = (1000*60)/($("#bpm").val());
  //   if((now % beat) === 0) {
  //     $('.step').toggleClass('trigger');
  //   }
  // }

  function Source(vco, vcoType, vcoFreq, vca, vcaGainVal) {
    this.vco = vco;
    this.vcoType = vcoType;
    this.vcoFreq = vcoFreq;
    this.vca = vca;
    this.vcaGainVal = vcaGainVal;
    this.vcaAttack = function () {
      now = context.currentTime;
      console.log(now);
      this.vcaGainVal.cancelScheduledValues(now);
      this.vcaGainVal.setValueAtTime(this.vcaGainVal, now);
      this.vcaGainVal.linearRampToValueAtTime(1, now + 0.2);
      }
    this.vcaRelease = function() {
      now = context.currentTime;
      vca.gain.cancelScheduledValues(now);
      vca.gain.setValueAtTime(this.vca.gain.value, now);
      vca.gain.linearRampToValueAtTime(0, now + 3);
      }
    }

  function createSources() {
    for(i = 0; i < 16; i++) {
      vcos[i] = context.createOscillator();
      vcos[i].type = 'sine';
      vcas[i] = context.createGain();

      vcos[i].connect(vcas[i]);
      vcas[i].connect(out);

      vcos[i].frequency = 440;
      vcas[i].gain.value = 0.00;

      sources[i] = new Source(vcos[i], vcos[i].type, vcos[i].frequency, vcas[i], vcas[i].gain.value);

      sources[i].vco.start();
      }
    }

  // metronome();
  createSources();


  for(i = 0; i < 15; i++) {
    var $step = $('#step' + [i].toString());
    $step.click(function() {
      sources[i].vcaAttack();
      sources[i].vcaRelease();
    });
  }

});
