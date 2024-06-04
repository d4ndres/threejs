varying vec3 vertexNormal;

void main() {
 float intensity = 0.6 - dot(vertexNormal, vec3(0,0,1));
  vec3 atmosphere = vec3(0.3, 0.6, 1.0) * pow(intensity, 2.0);
  gl_FragColor = vec4(atmosphere, 1.0);
  // float intensity = pow(1.05 - dot(vertexNormal, vec3(0,0,1)), 1.0);
  // gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
}