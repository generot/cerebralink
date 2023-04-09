#include <arduinoFFT.h>

#define BAUD_RATE 9600
#define SAMPLING_FREQ 256 //Hz
#define PERIOD_MICROS 1000000 / SAMPLING_FREQ

//We want as little delay on this as possible.
//Mind the sizes of the two 'double' arrays, dependent on this value!
#define MAX_SAMPLES 128

//Pins
#define SIGNAL_PIN A2

double samples[MAX_SAMPLES];
double magnitudes[MAX_SAMPLES];

int input = 0;
int samples_ix = 0;

unsigned long last_time = 0;

//Init FFT library.
arduinoFFT fft = arduinoFFT(samples, magnitudes, MAX_SAMPLES, SAMPLING_FREQ);

void getCorrespondingFreq(int i) {
  //i -> index of current sample [0; MAX_SAMPLES / 2]
  //freq_i = i * SAMPLING_FREQ / MAX_SAMPLES -> 
  // -> [0; MAX_SAMPLES / 2] (/ MAX_SAMPLES) ->
  // -> [0; 1/2] -> (* SAMPLING_FREQ)        ->
  // -> [0; SAMPLING_FREQ / 2]
  float freq_i = (float)i * SAMPLING_FREQ / (float)MAX_SAMPLES;

  Serial.print(String(samples[i] / 10) + "\n");
}

void setup() {
  Serial.begin(BAUD_RATE);
}

void loop() {
  input = analogRead(SIGNAL_PIN);
  
  if(samples_ix < MAX_SAMPLES) {
    unsigned long curr_time = micros();
    
    if(curr_time - last_time >= PERIOD_MICROS) {
      if(input < 1024) {
        samples[samples_ix++] = (double)input;
        Serial.println(input);
      }

      last_time = curr_time;
    }
  } else {  
    fft.Windowing(FFT_WIN_TYP_HAMMING, FFT_FORWARD);
    fft.Compute(FFT_FORWARD);
    fft.ComplexToMagnitude();

//    for(int i = 0; i < MAX_SAMPLES / 2; i++) {
//      getCorrespondingFreq(i);
//    }
//  
    for(int i = 0; i < MAX_SAMPLES; i++) {
      samples[i] = 0;
      magnitudes[i] = 0;
    }

    Serial.print("Done\n");
    samples_ix = 0;
  }
}
