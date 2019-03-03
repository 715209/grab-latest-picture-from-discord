const Discord = require("discord.js");
const download = require("image-downloader");

const client = new Discord.Client();
const config = require("./config.json");

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
    const channel = msg.channel.name === config.channel && msg.author.id === config.watchUserId ? true : false;
    if (!channel) return;

    if (msg.attachments.size > 0) {
        // let's just grab the last image for now
        const lastImage = Array.from(msg.attachments.values()).pop();
        const imageReg = /[\/.](gif|jpg|jpeg|tiff|png)$/i;
        const isImage = imageReg.test(lastImage.filename);

        if (isImage) {
            download
                .image({
                    url: lastImage.url,
                    dest: config.imgLocation // Save to /path/to/dest/image.jpg
                })
                .then(({ filename, image }) => {
                    console.log("File saved to", filename);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }
});

client.login(config.token);
