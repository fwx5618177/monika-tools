export function capitalizeFirstLetter(string: string) {
  if (!string) return string;
  return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
}

export const getImageResolution = (
  file: File
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = (error) => {
      reject(error);
    };
  });
};
