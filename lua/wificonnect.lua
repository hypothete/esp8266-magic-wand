wifi.setmode(wifi.STATION)
wifi.sta.config({ssid = "yourNetwork", pwd = "yourPassword"})
local wtimer = tmr.create()
wtimer:alarm(3000, tmr.ALARM_AUTO, function ()
    local ip, _, router = wifi.sta.getip()
    if (ip) then
        wtimer:stop()
        print("Connected to wifi: "..ip)
        print("router: "..router)
        dofile("websocket.lua")
    else
        print("connecting...")
    end
end)
