uniform sampler2D planeTexture;
uniform float dist;
varying vec2 vUv;

void main() {
  vec2 iResolution = vec2(1, 1);
  vec2 uv = (vUv - .5 * iResolution.xy) / iResolution.y;

  vec4 col = texture2D(planeTexture, vUv);

  float bw_col = (col.r + col.g + col.b) / 3.;
  vec4 bw_mix = vec4(bw_col, bw_col, bw_col, 1);

  // gl_FragColor = vec4(col);
  gl_FragColor = mix(bw_mix, col, dist);
  gl_FragColor.a = clamp(dist, .2, 1.);
}