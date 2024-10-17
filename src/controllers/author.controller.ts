import {
  Controller,
  Get,
  Post,
  Delete,
  Route,
  Path,
  Body,
  Tags,
  Patch,
  Security,
} from "tsoa";
import { authorService } from "../services/author.service";
import {
  AuthorInputDTO,
  AuthorInputPatchDTO,
  AuthorOutputDTO,
} from "../dto/author.dto";
import { BookOutputDTO } from "../dto/book.dto";

@Route("authors")
@Tags("Authors")
export class AuthorController extends Controller {
  
  // Récupère tous les auteurs (accessible à tous)
  @Get("/")
  @Security("jwt") // Tous les utilisateurs peuvent accéder à cette route
  public async getAllAuthors(): Promise<AuthorOutputDTO[]> {
    return authorService.getAllAuthors();
  }

  // Récupère un auteur par ID (accessible à tous)
  @Get("{id}")
  @Security("jwt") // Tous les utilisateurs peuvent accéder à cette route
  public async getAuthorById(@Path() id: number): Promise<AuthorOutputDTO> {
    return authorService.getAuthorById(id);
  }

  // Crée un nouvel auteur (accessible uniquement par l'administrateur et le gérant)
  @Post("/")
  @Security("jwt", ["author:post"]) // Vérifie si l'utilisateur a le droit de créer un auteur
  public async createAuthor(
    @Body() requestBody: AuthorInputDTO,
  ): Promise<AuthorOutputDTO> {
    const { first_name, last_name } = requestBody;
    return authorService.createAuthor(first_name, last_name);
  }

  // Supprime un auteur par ID (accessible uniquement par l'administrateur)
  @Delete("{id}")
  @Security("jwt", ["author:delete"]) // Vérifie si l'utilisateur a le droit de supprimer un auteur
  public async deleteAuthor(@Path() id: number): Promise<void> {
    await authorService.deleteAuthor(id);
  }

  // Met à jour un auteur par ID (accessible uniquement par l'administrateur et le gérant)
  @Patch("{id}")
  @Security("jwt", ["author:update"]) // Vérifie si l'utilisateur a le droit de mettre à jour un auteur
  public async updateAuthor(
    @Path() id: number,
    @Body() requestBody: AuthorInputPatchDTO,
  ): Promise<AuthorOutputDTO> {
    const { first_name, last_name } = requestBody;
    return authorService.updateAuthor(id, first_name, last_name);
  }

  // Récupère tous les livres d'un auteur par ID (accessible à tous)
  @Get("{id}/books")
  @Security("jwt") // Tous les utilisateurs peuvent accéder à cette route
  public async getBooksByAuthorId(
    @Path() id: number,
  ): Promise<BookOutputDTO[]> {
    return await authorService.getBooksByAuthorId(id);
  }
}
