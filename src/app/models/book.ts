export class BookModel {
    borrowBy: string;
    photo: string;
    constructor(public title: string,
                public author: string,
                public owner: string) {}

}
