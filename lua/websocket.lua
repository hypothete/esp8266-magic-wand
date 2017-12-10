local ws = websocket.createClient()
local received = 0

ws:on("connection", function ()
    print("connected to websocket server!")
    ws:send("hello!")
end)

ws:on("receive", function (_, msg)
    received = received + 1
    if (string.find(msg,"#") == 1) then
        local msg = string.sub(msg,2)
        --print(msg)
        updateleds(msg)
    end
end)

ws:on("close", function (_, status)
    ws:close()
    print("closed websocket:"..status)
    print("received "..received.." messages")
    ws = nil
end)

ws:connect("ws://192.168.137.1:8080")

function updateleds (msg)
    --print(msg)
    local leds = {}
    for i=1, 48 do
        local hex = string.sub(msg,i,i)
        local num = tonumber(hex, 16)
        if (num == nil) then
            print("err at "..hex..": "..i)
            num = 0
        end
        num = num
        table.insert(leds, string.char(num))
        if (i == 48) then
            local ledsconcat = table.concat(leds)
            ws2812.write(ledsconcat)
        end
    end
end
