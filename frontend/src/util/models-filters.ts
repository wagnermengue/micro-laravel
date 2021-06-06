import {Category, Genre} from "./models";

export function getGenresFromCategory(genres: Genre[], category: Category) {
    // erro quando entra no editar: genre.categories | undefined is not an object
    return genres.filter(
        genre => genre.categories.filter(cat => cat.id === category.id).length !== 0
    )
}