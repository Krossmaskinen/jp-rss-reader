import {Router, RouterConfiguration} from 'aurelia-router';

export class App {
  public router: Router;

  public configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'JP RSS Reader';
    config.map([
      { route: ['', 'feeds'], name: 'feed', moduleId: 'feed-list', nav: true, title: 'Feeds' }
    ]);

    this.router = router;
  }
}
