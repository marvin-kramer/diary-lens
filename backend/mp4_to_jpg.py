from moviepy.editor import *


def mp4_to_jpg(mp4_name, upload_dir):
    mp4_path = os.path.join(upload_dir, mp4_name)
    clip = VideoFileClip(mp4_path)
    jpg_name = os.path.splitext(mp4_name)[0] + '.jpg'
    jpg_path = os.path.join(upload_dir, jpg_name)
    clip.save_frame(jpg_path, t=1)
    return jpg_path, jpg_name
