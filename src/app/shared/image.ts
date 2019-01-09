export class Image {
    id: String;
    owner: String;
    secret: String;
    server: String;
    farm: Number;
    title: String;
    ispublic: Number;
    isfriend: Number;
    isfamily: Number;

    constructor(id: String) {
        this.id = id;
    }
}
