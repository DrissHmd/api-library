import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Path,
  Post,
  Route,
  Tags,
  Security,
} from "tsoa";
import {
  BookInputDTO,
  BookInputPatchDTO,
  BookOutputDTO,
} from "../dto/book.dto";
import { bookService } from "../services/book.service";
import { BookCollectionOutputDTO } from "../dto/bookCollection.dto";

@Route("books")
@Tags("Books")
export class BookController extends Controller {
  
  // Récupère tous les livres (accessible à tous)
  @Get("/")
  @Security("jwt") // Tous les utilisateurs peuvent accéder à cette route
  public async getAllBooks(): Promise<BookOutputDTO[]> {
    return bookService.getAllBooks();
  }

  // Récupère un livre par ID (accessible à tous)
  @Get("{id}")
  @Security("jwt") // Tous les utilisateurs peuvent accéder à cette route
  public async getBook(@Path("id") id: number): Promise<BookOutputDTO> {
    return await bookService.getBookById(id);
  }

  // Crée un nouveau livre (accessible uniquement par l'administrateur et le gérant)
  @Post("/")
  @Security("jwt", ["book:post"]) // Vérifie si l'utilisateur a le droit de créer un livre
  public async postBooks(
    @Body() requestBody: BookInputDTO,
  ): Promise<BookOutputDTO> {
    return bookService.createBook(
      requestBody.title,
      requestBody.publish_year,
      requestBody.author_id,
      requestBody.isbn,
    );
  }

  // Met à jour un livre par ID (accessible uniquement par l'administrateur et le gérant)
  @Patch("{id}")
  @Security("jwt", ["book:update"]) // Vérifie si l'utilisateur a le droit de mettre à jour un livre
  public async patchBook(
    @Path("id") id: number,
    @Body() requestBody: BookInputPatchDTO,
  ): Promise<BookOutputDTO> {
    return bookService.updateBook(
      id,
      requestBody.title,
      requestBody.publish_year,
      requestBody.author_id,
      requestBody.isbn,
    );
  }

  // Supprime un livre par ID (accessible uniquement par l'administrateur)
  @Delete("{id}")
  @Security("jwt", ["book:delete"]) // Vérifie si l'utilisateur a le droit de supprimer un livre
  public async deleteBook(@Path("id") id: number): Promise<void> {
    await bookService.deleteBook(id);
  }

  // Récupère toutes les collections d'un livre par ID (accessible à tous)
  @Get("{id}/book-collections")
  @Security("jwt") // Tous les utilisateurs peuvent accéder à cette route
  public async getBookCollectionsByBookId(
    @Path() id: number,
  ): Promise<BookCollectionOutputDTO[]> {
    return bookService.getBookCollectionsByBookId(id);
  }
}
