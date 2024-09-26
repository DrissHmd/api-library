import { Author } from "../models/author.model";
import { Book } from "../models/book.model";
import { BookCollection } from "../models/bookCollection.model";
import { ForbiddenError, NotFoundError } from "../utils/errors";

export class AuthorService {
  // Récupère tous les auteurs
  public async getAllAuthors(): Promise<Author[]> {
    return Author.findAll();
  }

  // Récupère un auteur par ID
  public async getAuthorById(id: number): Promise<Author | null> {
    return Author.findByPk(id);
  }

  // Crée un nouvel auteur
  public async createAuthor(
    firstName: string,
    lastName: string
  ): Promise<Author> {
    return Author.create({first_name: firstName, last_name: lastName });
  }

  // Supprime un auteur par ID
  public async deleteAuthor(id: number): Promise<void> {
    const author = await Author.findByPk(id);

    if (!author) {
      throw new NotFoundError("Auteur introuvable.");
    }

    const hasBooks = await Book.findOne({ where: { author_id: id } });
  
    if (hasBooks) {
      throw new ForbiddenError("L'auteur ne peut pas être supprimé, car il possède encore des livres dans la bibliothèque.");
    }
  
    await author.destroy();
  }

  // Met à jour un auteur
  public async updateAuthor(
    id: number,
    firstName?: string,
    lastName?: string
  ): Promise<Author | null> {
    const author = await Author.findByPk(id);
    if (author) {
      if (firstName) author.first_name = firstName;
      if (lastName) author.last_name = lastName;
      await author.save();
      return author;
    }
    return null;
  }

  public async getBooksByAuthor(authorId: number): Promise<Book[]> {
    const author = await Author.findByPk(authorId);

    if (!author) {
      throw new Error("Auteur introuvable.");
    }

    // Récupérer les livres liés à cet auteur
    return Book.findAll({ where: { author_id: authorId } });
  }
}

export const authorService = new AuthorService();
