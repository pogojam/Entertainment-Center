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
  float compression = cos(time * .01) * 3.2;
  p *= compression;
  p.xz *= Rotate(time * .01);

  return abs(.7 * dot(sin(p), cos(p.yzx)) / compression) - .02;
}

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0., 1.);
  return mix(b, a, h) - k * h * (1.0 - h);
}

vec3 GetColor(float amount) {
  vec3 col = 0.5 + 0.5 * cos(6.28319 *
                             (vec3(0.3, 0.0, 0.0) + amount * vec3(1., 1., .0)));
  return col * amount;
}

float MakeSphere(vec3 p, vec4 s) { return length(p - s.xyz) - s.w; }

float GetDist(vec3 p) {

  float sphereDist = MakeSphere(p, vec4(0, 1, 6, 1));
  float sphereBackgroundDist = MakeSphere(p, vec4(0, 1, 6, 3));

  float hollowSphere = abs(sphereDist) - .03;
  float hollowSphereBackground = abs(sphereBackgroundDist) - .03;

  float sphereDistGyroid = smin(hollowSphere, Gyroid(p), -.01);
  float sphereDistGyroidBackground =
      smin(hollowSphereBackground, Gyroid(p), -.08);

  sphereDist = min(sphereDistGyroid, sphereDistGyroidBackground);
  // sphereDist = sphereDistGyroid;

  // float plane =
  //     dot(p, normalize(vec3(Rotate(sin(time))) * vec3(.5, .5, mouse.y *
  //     .1)));

  // plane = abs(plane) - .009;

  // float orbitSphere = smin(plane, abs(hollowSphere - 1.), -.01) * .4;

  // float d = min(sphereDist, orbitSphere);
  float d = sphereDist;

  vec4 ms = vec4(mouse.x * 2.3, (mouse.y + .3) * 2.3, 6, .4);
  float mouseSphere = MakeSphere(p, ms);
  d = smin(d, mouseSphere, .9);

  return d;
}

float RayMarch(vec3 ro, vec3 rd) {
  float dO = 0.;

  for (int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * dO;
    float dS = GetDist(p);
    dO += dS;
    if (dO > MAX_DIST || abs(dS) < SURF_DIST)
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

vec4 GetLight(vec3 p) {
  // lightPos.xz += vec2(sin(time), cos(time)) * 2.;
  vec3 l = -normalize(p);
  vec3 n = GetNormal(p);

  float dif = dot(n, l) * .5 + .5;
  vec4 coloredLight = vec4(0., .0, .0, 1.);

  // float dif = clamp(dot(n, l), 0., 1.);
  float d = RayMarch(p + n * SURF_DIST * 2., l);
  if (d < length(l - p)) {
    coloredLight = vec4(GetColor(dif), 1);
  } else {
    coloredLight = vec4(vec3(dif), 1);
  }

  return coloredLight;
}

void main() {
  vec2 iResolution = vec2(1, 1);
  vec2 uv = (vUv - .5 * iResolution.xy) / iResolution.y;

  uv = vec2(uv.x + (mouse.x * .01), uv.y + (mouse.y * .01));
  vec4 col = vec4(0.);

  vec3 ro = vec3(0, 1, 0);

  vec3 rd = normalize(vec3(uv.x, uv.y, 1));

  // ro.yz *= Rotate(time * 1.3);
  // ro.xz *= Rotate(time) * 1.2;
  // o.y = max(ro.y, -.9);

  float d = RayMarch(ro, rd);

  if (d < MAX_DIST) {
    vec3 p = ro + rd * d;
    vec4 dif = GetLight(p);
    col = dif;
  }

  col.xyz = pow(col.xyz, vec3(.4545)); // gamma correction

  // col = texture(planeTexture, rd.xy) * col;
  // col = .03 * GetColor(2. * length(p));

  gl_FragColor = col;
}