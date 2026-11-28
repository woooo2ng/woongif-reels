set -e
printf "file 'out/scene_%d.mp4'\n" 0 1 2 3 4 5 > list.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i list.txt -c copy out/video.mp4
T=$(ffprobe -v error -show_entries format=duration -of csv=p=0 out/video.mp4)
ffmpeg -y -loglevel error -i audio/full.wav -af "apad,atrim=0:$T,loudnorm=I=-14:TP=-1.5:LRA=11,afade=t=out:st=$(python3 -c "print($T-0.4)"):d=0.4" -ac 2 -c:a aac -b:a 192k -ar 48000 voice.m4a
ffmpeg -y -loglevel error -i out/video.mp4 -i voice.m4a -map 0:v -map 1:a -c:v copy -shortest -movflags +faststart woongif_ESFJ_santa.mp4
ffprobe -v error -show_entries format=duration -of csv=p=0 woongif_ESFJ_santa.mp4
