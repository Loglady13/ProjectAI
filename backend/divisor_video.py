import cv2
import os
import tempfile

def split_video(video_path, parts):
    # Capturar el video
    capture = cv2.VideoCapture(video_path)
    if not capture.isOpened():
        print("Error: No se pudo abrir el archivo de video.")
        return

    # Obtener la cantidad total de fotogramas del video
    frame_count = int(capture.get(cv2.CAP_PROP_FRAME_COUNT))

    # Calcular el número de fotogramas por parte
    frames_per_segment = frame_count // parts

    # Escribir los fotogramas en los archivos correspondientes
    segment_index = 0
    frame_index = 0

    # Listas para almacenar los nombres de archivos temporales y los escritores de video
    temp_files = []
    writers = []

    # Crear escritores de video para cada parte
    for i in range(parts):
        base_name = os.path.splitext(os.path.basename(video_path))[0]
        temp_name = tempfile.NamedTemporaryFile(suffix=f'_{base_name}_{i+1}.avi', delete=False)
        temp_files.append(temp_name.name)
        temp_name.close()

        # Definir el códec y crear el escritor de video
        codec = cv2.VideoWriter_fourcc(*'XVID')
        writer = cv2.VideoWriter(temp_name.name, codec, capture.get(cv2.CAP_PROP_FPS),
                                 (int(capture.get(cv2.CAP_PROP_FRAME_WIDTH)),
                                  int(capture.get(cv2.CAP_PROP_FRAME_HEIGHT))))
        writers.append(writer)

    while True:
        ret, frame = capture.read()
        if not ret:
            break

        writers[segment_index].write(frame)
        frame_index += 1

        if frame_index >= frames_per_segment:
            frame_index = 0
            segment_index += 1
            if segment_index >= parts:
                break

    # Liberar recursos
    capture.release()
    for writer in writers:
        writer.release()

    print(f"Video dividido en {parts} partes con éxito.")

    return temp_files
