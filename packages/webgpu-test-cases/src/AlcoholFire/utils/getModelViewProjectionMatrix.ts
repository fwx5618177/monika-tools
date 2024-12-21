import { mat4 } from 'gl-matrix';

export function getModelViewProjectionMatrix(canvas: HTMLCanvasElement): Float32Array {
  const aspect = canvas.width / canvas.height;
  const projectionMatrix = mat4.perspective(mat4.create(), Math.PI / 4, aspect, 0.1, 100.0);
  const viewMatrix = mat4.lookAt(mat4.create(), [0, 2, 5], [0, 0, 0], [0, 1, 0]); // 摄像机从 (0, 2, 5) 看向 (0, 0, 0)
  const modelMatrix = mat4.create(); // 可以旋转或缩放模型

  const mvpMatrix = mat4.create();
  mat4.multiply(mvpMatrix, projectionMatrix, viewMatrix);
  mat4.multiply(mvpMatrix, mvpMatrix, modelMatrix);

  return new Float32Array(mvpMatrix);
}