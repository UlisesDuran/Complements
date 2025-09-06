const mongoose = require("mongoose");
const xlsx = require("xlsx");
const path = require("path");

// Configuración de MongoDB
const mongoURI =
  "mongodb://root:M0n90C4rt3rb2o21@app.mobility-assistance.com:27017/tower-auth?retryWrites=true&loadBalanced=false&serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-256";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Conexión a MongoDB
mongoose.connect(mongoURI, options);

// Definir el esquema del usuario
const userSchema = new mongoose.Schema({
  source: {
    id: String,
    from: String,
    _id: mongoose.Schema.Types.ObjectId,
  },
  workphone: String,
  email: String,
  image: String,
  imagethumb: String,
});

// Crear el modelo de usuario
const User = mongoose.model("User", userSchema);

// Leer el archivo Excel
const workbook = xlsx.readFile(
  path.join(__dirname, "../ExternalData/users.csv")
);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet);

// Función para actualizar los documentos en MongoDB
const updateUsers = async () => {
  for (const row of data) {
    const { user_uuid, user_telefono2, user_email1, thumbnail } = row;

    const user = await User.findOne({
      "source.id": user_uuid,
      active: true,
    });

    if (user) {
      const emailExists = await User.findOne({
        email: user_email1,
        _id: { $ne: user._id },
      });

      if (emailExists) {
        console.log(
          `El email ${user_email1} ya está en uso por otro usuario. Actualizando otros datos.`
        );
      } else {
        user.email = user_email1;
      }

      if (!user.workphone) user.workphone = user_telefono2;
      user.image = thumbnail;
      user.imagethumb = thumbnail;

      await user.save();
      console.log(`Usuario ${user_uuid} actualizado.`);
    } else {
      console.log(`Usuario ${user_uuid} no encontrado.`);
    }
  }
};

// Ejecutar la función de actualización
updateUsers()
  .then(() => {
    console.log("Actualización completa.");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error actualizando usuarios:", error);
    mongoose.connection.close();
  });
