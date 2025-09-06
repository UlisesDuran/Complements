const mongoose = require("mongoose");
const fs = require("fs");
const { Parser } = require("json2csv");

// URIs
const authURI =
  "mongodb://root:M0n90C4rt3rb2o21@app.mobility-assistance.com:27017/tower-auth?authSource=admin&authMechanism=SCRAM-SHA-256";
const chatURI =
  "mongodb://root:M0n90C4rt3rb2o21@app.mobility-assistance.com:27017/tower-chat?authSource=admin&authMechanism=SCRAM-SHA-256";

const options = { useNewUrlParser: true, useUnifiedTopology: true };

// Modelos
const userSchema = new mongoose.Schema({}, { strict: false });
const talkerSchema = new mongoose.Schema({}, { strict: false });

const badUsersFile = "../ExternalData/duplisTalkers.csv";
const goodTalkersFile = "../ExternalData/goodTalkers.csv";
const notFoundUsersFile = "../ExternalData/notFoundUsers.csv";

const run = async () => {
  const authConn = await mongoose.createConnection(authURI, options);
  const User = authConn.model("User", userSchema, "users");

  const chatConn = await mongoose.createConnection(chatURI, options);
  const Talker = chatConn.model("Talker", talkerSchema, "talkers");

  try {
    const users = await User.find(
      {
        type: "ONROAD",
        corporateuuid: "acc76911-065c-4794-8c51-b543f4a12558",
      },
      { _id: 0, workphone: 1, uuid: 1 }
    ).lean();

    console.log(
      `✅ Usuarios ONROAD encontrados en tower-auth: ${users.length}`
    );

    const badUsers = [];
    const goodTalkers = [];
    const notFoundUsers = [];

    for (const u of users) {
      if (!u.workphone) continue;
      let whatsappPhone = "34" + u.workphone;

      const talkersDuplis = await Talker.find(
        {
          $or: [{ phone: u.workphone }, { phone: whatsappPhone }],
          uuid: { $ne: u.uuid },
        },
        {
          _id: 1,
          phone: 1,
          name: 1,
          surname: 1,
          email: 1,
          chatIdentifier: 1,
          uuid: 1,
        }
      ).lean();

      if (talkersDuplis.length > 0) {
        console.log("👤 Talkers Duplis encontrados:", talkersDuplis.length);
        for (const t of talkersDuplis) {
          const newPhone = `ERROR${t.phone}`;
          await Talker.updateOne({ _id: t._id }, { $set: { phone: newPhone } });
          console.log(`📌 Talker ${t._id} actualizado -> ${newPhone}`);
          console.log("👤 Duplicado:", t);
          badUsers.push(t);
        }
      }
    }

    if (badUsers.length > 0) {
      const parser = new Parser({ fields: Object.keys(badUsers[0]) });
      const csv = parser.parse(badUsers);

      fs.writeFileSync(badUsersFile, csv, "utf8");
      console.log(
        `📄 Archivo CSV generado con ${badUsers.length} registros: ${badUsersFile}`
      );
    } else {
      console.log("🎉 No se encontraron talkers duplicados.");
    }

    if (goodTalkers.length > 0) {
      const parser = new Parser({ fields: Object.keys(goodTalkers[0]) });
      const csv = parser.parse(goodTalkers);

      fs.writeFileSync(goodTalkersFile, csv, "utf8");
      console.log(
        `📄 Archivo CSV generado con ${goodTalkers.length} registros: ${goodTalkersFile}`
      );
    } else {
      console.log("🎉 No se encontraron talkers por workphone y uuid.");
    }

    if (notFoundUsers.length > 0) {
      const parser = new Parser({ fields: Object.keys(notFoundUsers[0]) });
      const csv = parser.parse(notFoundUsers);
      fs.writeFileSync(notFoundUsersFile, csv, "utf8");
      console.log(
        `📄 Archivo CSV generado con ${notFoundUsers.length} registros: ${notFoundUsersFile}`
      );
    } else {
      console.log("🎉 No hubo usuarios sin talker registrado.");
    }
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await authConn.close();
    await chatConn.close();
  }
};

run();
