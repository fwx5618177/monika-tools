export const cloudShader = `
precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float time;

void main(void) {
  vec4 color = texture2D(uSampler, vTextureCoord);
  float distanceFromCenter = distance(vTextureCoord, vec2(0.5, 0.5));
  float glow = 0.5 + 0.5 * sin(time) * (1.0 - distanceFromCenter);

  gl_FragColor = color + glow * color;
}`;

export const extractBrightnessFragmentShader = `
precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float threshold;

void main(void) {
    vec4 color = texture2D(uSampler, vTextureCoord);
    float brightness = max(max(color.r, color.g), color.b);
    if (brightness < threshold) {
        gl_FragColor = vec4(0.2, 0.2, 0.2, 1.0);
    } else {
        gl_FragColor = color;
    }
}`;
