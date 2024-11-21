import json
import os
import plotly.graph_objects as go
import numpy as np
from concurrent.futures import ThreadPoolExecutor

def plot_general_stats(classes, counts, mean_confidences):
    fig_counts = go.Figure(data=[go.Pie(labels=classes, values=counts, hole=0.3, marker_colors=['yellow', 'pink', 'lightblue', 'lightgreen'])])
    fig_counts.update_layout(title='Apariciones')

    fig_confidences = go.Figure(data=[go.Pie(labels=classes, values=mean_confidences, hole=0.3, marker_colors=['pink', 'yellow', 'lightblue', 'lightgreen'])])
    fig_confidences.update_layout(title='Confianza de apariciones')

    # Convert the figures to JSON
    counts_plot_json = fig_counts.to_json()
    confidences_plot_json = fig_confidences.to_json()

    return {
        "counts_plot": counts_plot_json,
        "confidences_plot": confidences_plot_json,
        "stats": [
            {"class": class_name, "count": count, "mean_confidence": mean_confidence}
            for class_name, count, mean_confidence in zip(classes, counts, mean_confidences)
        ]
    }

def process_video(video, frames):
    class_counts = {}
    class_confidences = {}

    for frame_info in frames.values():
        detections = frame_info['Detections']
        for detection in detections:
            class_name = detection['Class']
            confidence = detection['Confidence']

            if class_name in class_counts:
                class_counts[class_name] += 1
                class_confidences[class_name].append(confidence)
            else:
                class_counts[class_name] = 1
                class_confidences[class_name] = [confidence]

    return class_counts, class_confidences

def plot_class_and_general_stats(json_data):
    all_class_counts = {}
    all_class_confidences = {}

    with ThreadPoolExecutor() as executor:
        futures = [executor.submit(process_video, video, frames) for video, frames in json_data.items()]

        for future in futures:
            try:
                class_counts, class_confidences = future.result()
                for class_name, count in class_counts.items():
                    if class_name in all_class_counts:
                        all_class_counts[class_name] += count
                        all_class_confidences[class_name].extend(class_confidences[class_name])
                    else:
                        all_class_counts[class_name] = count
                        all_class_confidences[class_name] = class_confidences[class_name]
            except Exception as e:
                print(f"Error processing video: {e}")

    all_class_mean_confidence = {class_name: np.mean(confidences) for class_name, confidences in all_class_confidences.items()}

    classes = list(all_class_counts.keys())
    counts = list(all_class_counts.values())
    mean_confidences = [all_class_mean_confidence[class_name] for class_name in classes]

    return plot_general_stats(classes, counts, mean_confidences)
