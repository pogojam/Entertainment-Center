#define MAX_STEPS 150
#define MAX_DIST 100.
#define SURF_DIST .001
uniform sampler2D planeTexture;
uniform float hasTexture;
uniform float shift;
uniform float scale;
uniform int width;
uniform int height;
uniform vec3 color;
uniform float opacity;
varying vec2 vUv;
uniform float time;
uniform vec2 mouse;

mat2 Rotate(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

float Gyroid(vec3 p) {
  float compression = cos(time * .01) * 10.2;
  p *= compression;
  p.xz *= Rotate(time * .01);

  return abs(.7 * dot(sin(p), cos(p.yzx)) / compression) - .02;
}

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0., 1.);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float GetDist(vec3 p) {
  vec4 s = vec4(0, 1, 6, 1);

  float sphereDist = length(p - s.xyz) - s.w;

  float hollowSphere = abs(sphereDist) - .03;

  sphereDist = smin(hollowSphere, Gyroid(p), -.01);

  float plane =
      dot(p, normalize(vec3(mouse.x, mouse.y, sin(mouse.x * mouse.y))));
  plane = abs(plane) - .1;

  float orbitSphere = max(plane, hollowSphere - .8);

  float d = min(sphereDist, orbitSphere);
  return d;
}

float RayMarch(vec3 ro, vec3 rd) {
  float dO = 0.;

  for (int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * dO;
    float dS = GetDist(p);
    dO += dS;
    if (dO > MAX_DIST || dS < SURF_DIST)
      break;
  }

  return dO;
}

vec3 GetNormal(vec3 p) {
  float d = GetDist(p);
  vec2 e = vec2(.001, 0);

  vec3 n = d - vec3(GetDist(p - e.xyy), GetDist(p - e.yxy), GetDist(p - e.yyx));

  return normalize(n);
}

float GetLight(vec3 p) {
  vec3 lightPos = vec3(0, 5, 6);
  // lightPos.xz += vec2(sin(time), cos(time)) * 2.;
  vec3 l = -normalize(p);
  vec3 n = GetNormal(p);

  float dif = clamp(dot(n, l), 0., 1.);
  float d = RayMarch(p + n * SURF_DIST * 2., l);
  // if (d < length(lightPos - p))
  //   dif *= .1;

  return dif;
}

void main() {
  vec2 iResolution = vec2(1, 1);
  vec2 uv = (vUv - .5 * iResolution.xy) / iResolution.y;

  vec3 col = vec3(0);

  vec3 ro = vec3(0, 1, 0);
  vec3 rd = normalize(vec3(uv.x, uv.y, 1));

  // ro.yz *= Rotate(time * 1.3);
  // ro.xz *= Rotate(time) * 1.2;
  // o.y = max(ro.y, -.9);

  float d = RayMarch(ro, rd);

  vec3 p = ro + rd * d;

  float dif = GetLight(p);
  col = vec3(dif);

  col = pow(col, vec3(.4545)); // gamma correction

  gl_FragColor = vec4(col, 1.0);
}