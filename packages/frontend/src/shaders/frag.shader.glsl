uniform sampler2D planeTexture;
uniform float hasTexture;
uniform float shift;
uniform float scale;
uniform vec3 color;
uniform float opacity;
varying vec2 vUv;
uniform float time;

void main() {
  float angle = 8.55;
  vec2 p = (vUv - vec2(0.5, 0.5)) * (1.0 - scale) + vec2(0.5, 0.5);
  vec2 offset = shift * .3 / 4.0 * vec2(cos(angle), sin(angle));
  vec4 cr = texture(planeTexture, p + offset);
  vec4 cga = texture(planeTexture, p);
  vec4 cb = texture(planeTexture, p - offset);

  gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);
}