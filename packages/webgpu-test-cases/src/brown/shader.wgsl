struct Particle {
  position: vec2<f32>,
  velocity: vec2<f32>
};

@group(0) @binding(0) var<storage, read_write> particles : array<Particle>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) id : vec3<u32>) {
  let i = id.x;
  if (i >= 10000u) { return; }

  let random = vec2<f32>(fract(sin(f32(i) * 12.9898) * 43758.5453), fract(sin(f32(i) * 78.233) * 43758.5453));
  particles[i].velocity += (random - vec2<f32>(0.5, 0.5)) * 0.1;
  particles[i].position += particles[i].velocity;
}
