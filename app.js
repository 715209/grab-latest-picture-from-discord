const Discord = require("discord.js");
const download = require("image-downloader");
const { Server } = require("socket.io");
const { createServer } = require("http");
const fs = require('fs');
const path = require('path');

const httpServer = createServer((req, res) => {
    if (req.url === '/') {
        const filePath = path.join(__dirname, 'image.html');
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const io = new Server(httpServer);

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
    ]
});
const config = require("./config.json");

client.on("ready", () => {
    console.log(`[Discord] Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", msg => {
    if (!(config.channelIds.includes(msg.channelId) && config.watchUserIds.includes(msg.author.id))) return;

    if (msg.attachments.size > 0) {
        const imageReg = /[\/.](gif|jpg|jpeg|tiff|png)$/i;

        msg.attachments.map(obj => {
            const isImage = imageReg.test(obj.contentType);

            if (isImage) {
                io.emit("new", obj.url);

                const dest = path.join(__dirname, config.imgLocation);
                download
                    .image({
                        url: obj.url,
                        dest // Save to /path/to/dest/image.jpg
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

const port = 4000;
const hostname = '127.0.0.1';
httpServer.listen(port, hostname, () => {
    console.log(`[Server] running at http://${hostname}:${port}/`);
});
