import cv2
import sys
import base64

def process_frame(frame, beauty_level, brightness, noise_reduction):
    # 根据参数调整亮度
    frame = cv2.convertScaleAbs(frame, alpha=1 + (brightness / 100))

    # 模拟美颜和降噪（可以集成更复杂的AI模型进行替换）
    frame = cv2.GaussianBlur(frame, (5, 5), noise_reduction)

    return frame

def main(video_path):
    # 读取视频文件
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error: Unable to open video file {video_path}", file=sys.stderr)
        return

    try:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            # 读取前端传来的优化参数
            line = sys.stdin.readline().strip()
            try:
                beauty_level, brightness, noise_reduction = map(float, line.split(','))
            except ValueError as e:
                print(f"Error: {e}", file=sys.stderr)
                break

            # 处理当前帧
            processed_frame = process_frame(frame, beauty_level, brightness, noise_reduction)

            # 将处理后的帧转换为 JPEG 格式并编码为 Base64
            _, buffer = cv2.imencode('.jpg', processed_frame)
            frame_data = base64.b64encode(buffer).decode('utf-8')

            # 将编码后的帧通过标准输出发送给后端
            print(frame_data)
            sys.stdout.flush()

    except Exception as e:
        print(f"Error processing video: {e}", file=sys.stderr)
    finally:
        cap.release()
        print("Processing complete", file=sys.stderr)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: Video input file path required", file=sys.stderr)
        sys.exit(1)

    video_path = sys.argv[1]
    main(video_path)