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
  BookCollectionInputDTO,
  BookCollectionInputPatchDTO,
  BookCollectionOutputDTO,
} from "../dto/bookCollection.dto";
import { bookCollectionService } from "../services/bookCollection.service";

@Route("book-collections")
@Tags("BookCollections")
export class BookCollectionController extends Controller {
  
  // Récupère toutes les collections de livres (accessible à tous)
  @Get("/")
  @Security("jwt") // Tous les utilisateurs peuvent accéder à cette route
  public async getAllBooksCollection(): Promise<BookCollectionOutputDTO[]> {
    return bookCollectionService.getAllBookCollections();
  }

  // Récupère une collection de livres par ID
  @Get("{id}")
  @Security("jwt") // Tous les utilisateurs peuvent accéder à cette route
  public async getBookCollection(
    @Path("id") id: number,
  ): Promise<BookCollectionOutputDTO> {
    return bookCollectionService.getBookCollectionById(id);
  }

  // Crée une nouvelle collection de livres (accessible uniquement par l'administrateur et le gérant)
  @Post("/")
  @Security("jwt", ["bookCollection:post"]) // Vérifie si l'utilisateur a le droit de créer une collection
  public async postBookCollection(
    @Body() requestBody: BookCollectionInputDTO,
  ): Promise<BookCollectionOutputDTO> {
    return bookCollectionService.createBookCollection(
      requestBody.book_id,
      requestBody.available,
      requestBody.state,
    );
  }

  // Met à jour une collection de livres par ID (accessible uniquement par l'administrateur et le gérant)
  @Patch("{id}")
  @Security("jwt", ["bookCollection:update"]) // Vérifie si l'utilisateur a le droit de mettre à jour une collection
  public async patchBookCollection(
    @Path("id") id: number,
    @Body() requestBody: BookCollectionInputPatchDTO,
  ): Promise<BookCollectionOutputDTO> {
    return bookCollectionService.updateBookCollection(
      id,
      requestBody.book_id,
      requestBody.available,
      requestBody.state,
    );
  }

  // Supprime une collection de livres par ID (accessible uniquement par l'administrateur)
  @Delete("{id}")
  @Security("jwt", ["bookCollection:delete"]) // Vérifie si l'utilisateur a le droit de supprimer une collection
  public async deleteBookCollection(@Path("id") id: number): Promise<void> {
    await bookCollectionService.deleteBookCollection(id);
  }
}
