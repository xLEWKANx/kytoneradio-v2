# kytoneradio

### infa
central-srv.p-s.org.ua:15002
ssh -p 15022 curator@central-srv.p-s.org.ua


### Start

vagrant up
npm install --no-bin-links

### structure
- ./icecast
- ./liquidsoap
- ./logs
- ./music
    - jingles
    - day
        - music
        - playlist.mp3
    - night
        - music
        - playlist.mp3
- ./web
    - server
    - source
    - service
    - spec (Jasmine tests)
    - www (exec)
