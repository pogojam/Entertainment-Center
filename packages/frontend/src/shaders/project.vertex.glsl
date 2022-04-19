uniform float time;
uniform float dist;
varying vec2 vUv;
uniform sampler2D positionTexture;
attribute vec2 reference;
float PI = 3.141592653589793238;

// HELPER FUNCTIONS
void main() {

  vUv = (uv - vec2(.5)) * .9 + vec2(.5);

  vec3 pos = position;

  pos.y += sin(time * 1.3) * .17;
  vUv.y -= sin(time * .3) * .05;

  // Bending
  pos.y += sin(PI * vUv.x) * .05;
  pos.z += sin(PI * vUv.x) * .2;

  // Scaling
  pos.xy *= 1. + .2 * dist;
  vUv *= 1. + .2 * dist;
  // pos.y += 10.;

  vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;
}