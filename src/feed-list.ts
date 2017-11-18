import { Feed } from './feed';

export class FeedList {
    public title: string = 'Feeds';
    public feeds: Feed[] = [];

    constructor() {
        let aureliaBlog: Feed = new Feed({
            url: 'http://blog.aurelia.io/rss/',
            title: 'Aurelia Blog'
        });
        let zenHabits: Feed = new Feed({
            url: 'http://feeds.feedburner.com/zenhabits',
            title: 'Zen Habits'
        });

        this.feeds.push(zenHabits);
        this.feeds.push(aureliaBlog);
    }
}