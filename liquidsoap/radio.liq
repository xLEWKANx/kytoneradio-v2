#!/usr/bin/liquidsoap

garbage_collect()

out = output.icecast(

  host = "localhost",
  port = 15002,

  user = "source",
  password = "kytone",

  name = "Kytone",
  genre = "house/techno",

  url = "http://kytoneradio.com/",

  encoding = "UTF-8",
)

# enable telnet server
set("server.telnet.bind_addr", "127.0.0.1")
set("server.telnet", true)

# work directories
work_dir = "/media/datadrive/"
sys_dir = "/home/curator/kytoneradio/"
music_day_dir = "#{work_dir}/music/day"
music_night_dir = "#{work_dir}/music/night"
stable_dir = "#{work_dir}/music/stable"
jingles_dir = "#{work_dir}/jingles"

set("server.timeout",300.)

def apply_metadata(m) =
  title = m["title"]
  artist = m["artist"]
  filename = m["filename"]
  source = m["source"]
  on_air = m["on_air"]
  json = json_of([
    ("artist", "#{artist}"),
    ("title", "#{title}"),
    ("source", "#{source}"),
    ("filename", "#{filename}"),
    ("on_air", "#{on_air}")
  ])
  ignore(
    http.post(headers=[("Content-Type","application/json")],
    data="#{json}",
    "http://localhost:80/api/playlist/liquidsoap")
  )
end

# define music and mix with jingles
music_day = playlist('#{music_day_dir}/day.m3u', mode="normal")
music_night = playlist('#{music_night_dir}/night.m3u', mode="normal")

jingles = playlist('#{jingles_dir}')

stable = playlist.safe('#{stable_dir}')

day = rotate (weights = [1, 2], [jingles, music_day])
night = rotate (weights = [1, 2], [jingles, music_night])

# define live input
live_stream = strip_blank(input.http("http://localhost:15002/live.ogg"))

# schedule
scheduled_stream = switch([ ({22h-7h}, night), ({7h-22h}, day) ])

# stable cast
stable_stream = stable;

# fallback output with
radio = fallback(track_sensitive=false,
[live_stream, scheduled_stream, stable_stream])

radio = on_track(apply_metadata,radio)

out(
  %mp3(bitrate = 320, id3v2 = true),
  description = "MP3 320 Kbps",
  mount = "stream",
  mksafe(radio)
)






