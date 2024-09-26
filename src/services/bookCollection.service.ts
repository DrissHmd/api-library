import { Book } from "../models/book.model";
import { BookCollection } from "../models/bookCollection.model";
import { NotFoundError } from "../utils/errors"

export class BookCollectionService {
    public async getAllBookCollections(): Promise<BookCollection[]> {
        return BookCollection.findAll();
    }

    public async getBookCollectionById(id: number): Promise<BookCollection | null> {
        const collection = await BookCollection.findByPk(id);
        if (!collection) {
          throw new NotFoundError("La collection n'existe pas.");
        }
        return collection;
    }

    public async createBookCollection(book_id: number, available: boolean, state: number): Promise<BookCollection | null> {
        if (!await Book.findByPk(book_id)) {
            throw new NotFoundError("Le livre n'existe pas.");
        }
        return BookCollection.create({book_id, available, state});
    }

    public async updateBookCollection(id: number, book_id?: number, available?: boolean, state?: number): Promise<BookCollection | null> {
        const bookCollection = await BookCollection.findByPk(id);

        if (!bookCollection) throw new NotFoundError("La collection n'existe pas.");

        if (!await Book.findByPk(book_id)) {
            throw new NotFoundError("Le livre n'existe pas.");
        }

        if (available) bookCollection.available = available;
        if (state) bookCollection.state = state;
        
        await bookCollection.save();
        return bookCollection;
    }

    public async deleteBookCollection(id: number): Promise<void> {
        const bookCollection = await BookCollection.findByPk(id);
        if (!bookCollection) {
          throw new NotFoundError("La collection n'existe pas.");
        }
    
        await bookCollection.destroy();
      }
}

export const bookCollectionService = new BookCollectionService();
