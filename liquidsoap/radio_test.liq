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
work_dir = "/Users/macus/Documents/projects/kytoneradio"
sys_dir = "/Users/macus/Documents/projects/kytoneradio"
music_day_dir = "#{work_dir}/music/day"
music_night_dir = "#{work_dir}/music/night"
stable_dir = "#{work_dir}/music/stable"
jingles_dir = "#{work_dir}/music/jingles"

# enable unix sockets
#set("server.socket",true)
#set("server.socket.path","#{sys_dir}/liuqidsoap/socket")

set("server.timeout",300.)

# enable logging
set("log.file.path", "#{sys_dir}/logs/liquidsoap.log")
set("log.stdout",true)
set("log.level", 3)

# harbor
set("harbor.bind_addr","central-srv.p-s.org.ua")

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
  print(json);
  ignore(
    http.post(headers=[("Content-Type","application/json")],
    data="#{json}",
    timeout=1.,
    "http://localhost:3000/api/playlist/liquidsoap")
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
live_stream = strip_blank(input.http("http://central-srv.p-s.org.ua:15002/live"))

# schedule
scheduled_stream = switch([ ({18h-6h}, night), ({6h-18h}, day) ])

# stable cast
stable_stream = stable;

# fallback output with
radio = fallback(track_sensitive=false,
[live_stream, scheduled_stream, stable_stream])

radio = on_track(apply_metadata, radio)

out(
  %mp3(bitrate = 320, id3v2 = true),
  description = "MP3 320 Kbps",
  mount = "stream",
  mksafe(radio)
)
