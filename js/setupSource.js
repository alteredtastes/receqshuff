var context = new AudioContext();
var out = context.destination;
var sources = [];
var vcos = [];
var vcas = [];
var i;

function Source(vco, vcoFreq, vca, vcaGainVal) {
  this.vco = vco;
  this.vcoFreq = vcoFreq;
  this.vca = vca;
  this.vcaGainVal = vcaGainVal;
  this.vcaAttack = function() {
    var now = context.currentTime;
    this.vcaGainVal.cancelScheduledValues(now);
    this.vcaGainVal.setValueAtTime(vcaGainVal, now);
    this.vcaGainVal.linearRampToValueAtTime(1, now + 0.2);
    }
  this.vcaRelease = function() {
    var now = context.currentTime;
    vca.gain.cancelScheduledValues(now);
    vca.gain.setValueAtTime(vca.gain.value, now);
    vca.gain.linearRampToValueAtTime(0, now + 3);
    }

function createSources() {
  for(i = 0; i < 16; i++) {
    vco[i] = context.createOscillator();
    vca[i] = context.createGain();

    vco[i].connect(vca[i]);
    vca[i].connect(out);
    vco[i].start(0);

    vco[i].frequency = 440;
    vca[i].gain.value = 0;

    sources[i] = new Source(vco[i], vco[i].frequency, vca[i], vca[i].gain.value);
    }
  }

createSources();

for(i = 0; i < 15; i++) {
  $('#step' + [i].toString()).click(sources[i].vcaAttack(), sources[i].vcaRelease());
}
