import { Http, URLSearchParams } from '@angular/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { APIHost } from './helpers/api-host';
import { intensity } from './helpers/intensity';

@Injectable()
export class TwitterService {
  constructor(
    @Inject(APIHost) private apiHost: string,
    private http: Http,
  ) {}

  getLatestTweets(): Observable<Tweet[]> {
    const endpoint = `${this.apiHost}/1.1/statuses/user_timeline.json`;

    const params = new URLSearchParams();
    params.set('count', '200');
    params.set('screen_name', 'realDonaldTrump');
    params.set('trim_user', 'true');

    return this.http
      .get(endpoint, { params })
      .map(res => {
        const tweets = <Tweet[]> res.json();
        const maxIntensity = Math.max.apply(Math, tweets.map(({ text }) => intensity(text)));

        return tweets.map(tweet => {
          return {
            ...tweet,
            intensity: intensity(tweet.text) / maxIntensity,
          };
        });
      });
  }

  getTweet(id: string): Observable<Tweet> {
    const endpoint = `${this.apiHost}/1.1/statuses/show.json`;

    const params = new URLSearchParams();
    params.set('id', id);
    params.set('trim_user', 'true');
    params.set('include_entities', 'false');

    return this.http
      .get(endpoint, { params })
      .map(res => {
        const tweet = <Tweet> res.json();
        return { ...tweet, intensity: intensity(tweet.text) };
      });
  }
}
