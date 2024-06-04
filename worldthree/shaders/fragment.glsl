uniform sampler2D globeTexture;

varying vec2 vertexUV; // vec2(0,0.24)

varying vec3 vertexNormal;

void main() {
  // texture2D(globeTexture, vertexUV)
  // gl_FragColor = vec4(1, 0, 0, 1);
  // gl_FragColor = vec4(vec3(0,0,0.25) + texture2D(globeTexture, vertexUV).xyz, 1.0);
  float intensity = 1.05 - dot(vertexNormal, vec3(0,0,1));
  vec3 atmosphere = vec3(0.3, 0.6, 1.0) * pow(intensity, 1.5);
  
  // gl_FragColor = vec4( texture2D(globeTexture, vertexUV).xyz, 1.0);
  gl_FragColor = vec4(atmosphere + texture2D(globeTexture, vertexUV).xyz, 1.0);
}