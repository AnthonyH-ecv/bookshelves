export class BookModel {
    borrow = false;
    photo: string;
    constructor(public title: string,
                public author: string,
                public owner: string) {}

}
