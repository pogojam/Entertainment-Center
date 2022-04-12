uniform sampler2D planeTexture;
varying vec2 vUv;

void main() {
  vec2 iResolution = vec2(1, 1);
  vec2 uv = (vUv - .5 * iResolution.xy) / iResolution.y;

  vec4 col = texture2D(planeTexture, vUv);

  gl_FragColor = vec4(col);
}