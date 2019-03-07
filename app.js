const Discord = require("discord.js");
const download = require("image-downloader");
const io = require("socket.io")();

const client = new Discord.Client();
const config = require("./config.json");

client.on("ready", () => {
    console.log(`[Discord] Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
    if (!(config.channelIds.includes(msg.channel.id) && config.watchUserIds.includes(msg.author.id))) return;

    if (msg.attachments.size > 0) {
        const imageReg = /[\/.](gif|jpg|jpeg|tiff|png)$/i;

        msg.attachments.map(obj => {
            const isImage = imageReg.test(obj.filename);

            if (isImage) {
                io.emit("new", obj.url);

                download
                    .image({
                        url: obj.url,
                        dest: config.imgLocation // Save to /path/to/dest/image.jpg
                    })
                    .then(({ filename, image }) => {
                        console.log("[IMG] File saved to", filename, Date());
                    })
                    .catch(err => {
                        console.error(err);
                    });
            }
        });
    }
});

io.on("connection", socket => {
    socket.on("got the stuff?", yes => {
        yes({ seconds: config.popupSeconds });
    });
});

client.login(config.token);
io.listen(4000);
console.log("[Websocket] listening on port", 4000);
