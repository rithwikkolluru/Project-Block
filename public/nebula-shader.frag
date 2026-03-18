precision highp float;
varying vec2 vUv;
uniform float time;

void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float len = length(p);
    float angle = atan(p.y, p.x);

    // Simple cosmic swirl
    float cosmic = sin(len * 10.0 - time * 2.0 + angle);
    vec3 color = mix(vec3(0.04, 0.04, 0.1), vec3(0.38, 0.4, 0.94), cosmic * 0.5 + 0.5);

    gl_FragColor = vec4(color, 1.0);
}
