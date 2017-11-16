export class Post {
    public title: string;
    public link: string;
    public description: string;

    constructor(options?: Post) {
        if (!!options) {
            this.createFromOptions(options);
        }
    }

    private createFromOptions(options: any): void {
        this.title = options.title;
        this.link = options.link;
        this.description = options.description;
    }
}