import { BookModel } from './book';

export class UserModel {
    books: BookModel[] = [];

    constructor(public firstName: string, public lastName: string) {}
}
