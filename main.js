const TelegramBot = require("node-telegram-bot-api");
const token = "ur token";
const options = {
  polling: true
};
// bot create
const mybot = new TelegramBot(token, options);

// command
const prefix = "/";
const cmdList = new RegExp(`^${prefix}start`);
const sayHi = new RegExp(`^${prefix}halo`);
const infoGempa = new RegExp(`^${prefix}gempa`);
const infoAnime = new RegExp(`^${prefix}anime`);

// list cmd
mybot.onText(cmdList, callback => {
  mybot.sendMessage(callback.from.id, "ketik / untuk menampilkan command yang tersedia");
});

// say hi cmd
mybot.onText(sayHi, callback => {
  mybot.sendMessage(callback.from.id, "halo juga");
});

// info gempa cmd
mybot.onText(infoGempa, async callback => {
  const bmkg = "https://data.bmkg.go.id/DataMKG/TEWS/";
  try {
    const apiCall = await fetch(bmkg + "autogempa.json");
    const response = await apiCall.json();

    if (response && response.Infogempa && response.Infogempa.gempa) {
      const { Tanggal, Jam, Magnitude, Kedalaman, Wilayah, Potensi, Shakemap } =
        response.Infogempa.gempa;

      const bmkgImage = bmkg + Shakemap;
      const resultText = `
      Tanggal: ${Tanggal}
      Jam: ${Jam}
      Magnitude: ${Magnitude}
      Kedalaman: ${Kedalaman}
      Wilayah: ${Wilayah}
      Potensi: ${Potensi}`;

      mybot.sendPhoto(callback.from.id, bmkgImage, { caption: resultText });
    } else {
      mybot.sendMessage(
        callback.from.id,
        "Data gempa tidak tersedia saat ini."
      );
    }
  } catch (error) {
    mybot.sendMessage(
      callback.from.id,
      "Terjadi kesalahan saat mengambil data gempa."
    );
    console.error(error);
  }
});

// samehadaku latest cmd
mybot.onText(infoAnime, async callback => {
  const apiUrl = "https://api.nyx.my.id/anime/samehadakulatest";
  try {
    const response = await fetch(apiUrl);
    const animeData = await response.json();

    if (
      animeData &&
      animeData.status === "true" &&
      Array.isArray(animeData.result)
    ) {
      animeData.result.forEach((anime, index) => {
        const { thumbnail, url, title, episode, rilis } = anime;
        const caption = `

Title: ${title}
Episode: ${episode}
Rilis: ${rilis}
URL: ${url}`;

        mybot.sendPhoto(callback.from.id, thumbnail, { caption: caption });
      });
    } else {
      mybot.sendMessage(
        callback.from.id,
        "Data anime tidak tersedia saat ini."
      );
    }
  } catch (error) {
    mybot.sendMessage(
      callback.from.id,
      "Terjadi kesalahan saat mengambil data anime."
    );
    console.error("Error processing data:", error);
  }
});
