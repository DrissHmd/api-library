import { User } from "../models/user.model"; // Modèle Sequelize
import jwt from "jsonwebtoken"; // Pour générer le JWT
import { Buffer } from "buffer"; // Pour décoder Base64
import { notFound } from "../error/NotFoundError";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // Clé secrète pour signer le token

export class AuthenticationService {
  public async authenticate(
    username: string,
    password: string
  ): Promise<string> {
    // Recherche l'utilisateur dans la base de données
    const user = await User.findOne({ where: { username } });

    if (!user) {
      throw notFound("User");
    }

    // Décoder le mot de passe stocké en base de données
    const decodedPassword = Buffer.from(user.password, "base64").toString(
      "utf-8"
    );

    // Vérifie si le mot de passe est correct
    if (password === decodedPassword) {
      // Si l'utilisateur est authentifié, on génère un JWT
      let permissions: string[] = [];

      if (username === "admin") {
        // L'administrateur a tous les droits
        permissions = [
          "author:get",
          "author:post",
          "author:update",
          "author:delete",
          "book:get",
          "book:post",
          "book:update",
          "book:delete",
          "bookCollection:get",
          "bookCollection:post",
          "bookCollection:update",
          "bookCollection:delete",
        ];
      } else if (username === "gerant") {
        // Le gérant peut lire tout, créer et modifier sur toutes les tables,
        // supprimer uniquement sur la table d'exemplaire des livres "Book Collection"
        permissions = [
          "author:get",
          "book:get",
          "bookCollection:get",
          "author:post",
          "book:post",
          "bookCollection:post",
          "author:update",
          "book:update",
          "bookCollection:update",
          "bookCollection:delete", // Suppression uniquement sur bookCollection
        ];
      } else if (username === "utilisateur") {
        // L'utilisateur peut tout lire et créer un nouveau livre si l'auteur existe
        permissions = [
          "author:get",
          "book:get",
          "bookCollection:get",
          "book:post",
        ];
      } else {
        throw new Error("Invalid user");
      }

      const token = jwt.sign({ username: user.username, permissions }, JWT_SECRET, {
        expiresIn: "1h",
      });
      return token;
    } else {
      let error = new Error("Wrong password");
      (error as any).status = 403;
      throw error;
    }
  }
}

export const authService = new AuthenticationService();
