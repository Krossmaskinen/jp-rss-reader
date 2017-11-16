import { HttpClient } from 'aurelia-fetch-client';
import 'fetch';
import 'xml-js';
import { xml2json } from 'xml-js';
import { Post } from './post';
import { post } from 'selenium-webdriver/http';

export class Feed {
    public url: string;
    public title: string;
    public posts: Post[] = [];
    private http: HttpClient;

    constructor(options?: any) {
        this.http = new HttpClient();
        this.http.configure(config => {
            config
                .useStandardConfiguration()
        });

        if (!!options) {
            this.createFromOptions(options);
        }

        if (this.url) {
            this.loadPosts();
        }
    }

    private createFromOptions(options: any): void {
        this.url = options.url;
        this.title = options.title;
        this.posts = options.posts ? options.posts : this.posts;
    }

    private async loadPosts(): Promise<void> {
        let rawPosts: any = await this.http.fetch(this.url, {
            method: 'GET',
            mode: 'cors'
        })
        .then(result => result.text())
        .then(result => xml2json(result, {compact: true}))
        .then(result => JSON.parse(result))
        .then(result => result.rss.channel.item);

        rawPosts.forEach(post => {
            let parsedPost: any = {
                title: post.title._cdata,
                link: post.link._text,
                description: post.description._cdata
            };

            this.posts.push(new Post(parsedPost));
        });

        console.log(this.posts);
    }
}