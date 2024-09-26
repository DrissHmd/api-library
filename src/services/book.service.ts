import { Author } from "../models/author.model";
import { Book } from "../models/book.model";
import { NotFoundError } from "../utils/errors";

export class BookService {
  public async getAllBooks(): Promise<Book[]> {
    return Book.findAll({
        include: [{
            model: Author,
            as: 'author'
        }]
    });
  }

  public async getBookById(id: number): Promise<Book | null> { 
    return Book.findByPk(id, {
      include: [
        {
          model: Author,
          as: 'author',
        },
      ],
    });
  }

  public async createBook(title: string, publish_year: number, author_id: number, isbn: string): Promise<Book | null> {
    if (!await Author.findByPk(author_id)) {
      throw new NotFoundError("L'auteur n'existe pas.");
    }

    return Book.create({title, publish_year, author_id, isbn})
  }

  public async updateBook(id: number, title?: string, publish_year?: number, author_id?: number, isbn?: string ): Promise<Book | null> {
    const book = await Book.findByPk(id);
    if (!book) {
      throw new NotFoundError("Le livre n'existe pas.");
    }

    if (author_id && !(await Author.findByPk(author_id))) {
      throw new NotFoundError("L'auteur n'existe pas.");
    }

    if (title) book.title = title;
    if (publish_year) book.publish_year = publish_year;
    if (author_id) book.author_id = author_id;
    if (isbn) book.isbn = isbn;

    await book.save();
    return book;
  }
}

export const bookService = new BookService();
