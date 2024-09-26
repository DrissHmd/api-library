import { Body, Controller, Delete, Get, Patch, Path, Post, Route, Tags } from "tsoa";
import { BookCollectionDTO } from "../dto/bookCollection.dto";
import { bookCollectionService } from "../services/bookCollection.service";

@Route("books-collection")
@Tags("Book Collection")
export class BookCollectionController extends Controller {

  @Get("/")
  public async getAllBookCollections(): Promise<BookCollectionDTO[]> {
    return bookCollectionService.getAllBookCollections();
  }

  @Get("{id}")
  public async getBookCollectionById(id: number): Promise<BookCollectionDTO | null> {
    return bookCollectionService.getBookCollectionById(id);
  }

  @Post("/")
  public async createBookCollection(@Body() requestBody: BookCollectionDTO): Promise<BookCollectionDTO | null> {
    const {book_id, available, state} = requestBody;
    return bookCollectionService.createBookCollection(book_id, available, state);
  }

  @Patch("{id}")
  public async updateBookCollection(id: number, @Body() requestBody: Partial<BookCollectionDTO>): Promise<BookCollectionDTO | null> {
    const {book_id, available, state} = requestBody;
    return bookCollectionService.updateBookCollection(id, book_id, available, state);
  }

  @Delete("{id}")
  public async deleteBookCollection(@Path() id: number): Promise<void> {
    await bookCollectionService.deleteBookCollection(id);
  }
}
