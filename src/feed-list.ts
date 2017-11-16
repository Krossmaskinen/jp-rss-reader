import { Feed } from './feed';

export class FeedList {
    public title: string = 'Feeds';
    public feeds: Feed[] = [];

    constructor() {
        let testfeed: Feed = new Feed({
            url: 'http://blog.aurelia.io/rss/',
            title: 'Aurelia Blog'
        });

        this.feeds.push(testfeed);
    }
}