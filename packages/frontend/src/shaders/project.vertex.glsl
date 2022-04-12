uniform float time;
varying vec2 vUv;
uniform sampler2D positionTexture;
attribute vec2 reference;
float PI = 3.141592653589793238;

// HELPER FUNCTIONS
void main() {

  vUv = (uv - vec2(.5)) * .9 + vec2(.5);

  vec3 pos = position;

  pos.y += sin(time * .3) * .8;
  vUv.y -= sin(time * .3) * .05;

  // Bending
  pos.y += sin(PI * vUv.x) * .1;
  pos.z += sin(PI * vUv.x) * .4;

  // pos.y += 10.;

  vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;
}