import { Body, Controller, Get, Patch, Post, Route, Tags } from "tsoa";
import { BookDTO } from "../dto/book.dto";
import { bookService } from "../services/book.service";

@Route("books")
@Tags("Books")
export class BookController extends Controller {
  @Get("/")
  public async getAllBooks(): Promise<BookDTO[]> {
    return bookService.getAllBooks();
  }

  @Get("{id}")
  public async getBookById(id: number): Promise<BookDTO | null> {
    return bookService.getBookById(id);
  }

  @Post("/")
  public async createBook(@Body() requestBody: BookDTO ): Promise<BookDTO | null> {
    const {title, publish_year, isbn, author} = requestBody;
    if (!author || !author.id) {
      throw new Error("L'ID de l'auteur est requis.");
    }
    return bookService.createBook(title, publish_year, author.id, isbn);
  }

  @Patch("{id}")
  public async updateBook(id: number, @Body() requestBody: Partial<BookDTO>): Promise<BookDTO | null> {
    const { title, publish_year, isbn, author } = requestBody;
    const authorId = author ? author.id : undefined;

    return bookService.updateBook(id, title, publish_year, authorId, isbn);
  }
}