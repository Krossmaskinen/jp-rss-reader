import { HttpClient } from 'aurelia-fetch-client';
import 'fetch';
import 'xml-js';
import { xml2json } from 'xml-js';
import { Post } from './post';
import { post } from 'selenium-webdriver/http';
import { truncate, truncateSync } from 'fs';

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
        let isFeedBurnerUrl: boolean = (this.url.indexOf('feedburner') !== -1);
        let fetchBlogPromise: any;

        fetchBlogPromise = this.http.fetch(this.url, {
            method: 'GET',
            mode: 'cors'
        });

        if (!isFeedBurnerUrl) {
            fetchBlogPromise
                .then(result => result.text())
                .then(result => xml2json(result, {compact: true}))
                .then(result => JSON.parse(result))
                .then(result => result.rss.channel.item)
                .then(rawPosts => {
                    rawPosts.forEach(post => {
                        let parsedPost: any = {
                            title: post.title._cdata,
                            link: post.link._text,
                            description: post.description._cdata
                        };

                        this.posts.push(new Post(parsedPost));
                    });
                });
        } else {
            fetchBlogPromise
                .then(result => result.text())
                .then(result => {
                    let tempDoc: HTMLElement = document.createElement('html');

                    tempDoc.innerHTML = result;

                    return tempDoc.querySelectorAll('.regularitem');
                })
                .then(result => {
                    for (let i = 0; i < result.length; ++i) {
                        let item: HTMLElement = result[i];
                        let parsedPost: any = {};

                        parsedPost.title = item.querySelector('.itemtitle').textContent;
                        parsedPost.link = item.querySelector('.itemtitle a').getAttribute('href');
                        parsedPost.description = item.querySelector('.itemcontent h6 + p').textContent;
                        parsedPost.description = parsedPost.description.substring(0, 100) + '...';

                        this.posts.push(new Post(parsedPost));
                    }
                });
        }
    }
}