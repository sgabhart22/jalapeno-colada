import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap }
	from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]>;

  /* Subject is an Observable that is also a source of Observable values.
  	It can be subscribed to. We push a value into it by calling next().
  */
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
  	this.heroes$ = this.searchTerms.pipe(
		// Wait 300ms after keystrokes before considering term.
		debounceTime(300),
		// Ignore the term if it's the same as the previous one.
		distinctUntilChanged(),
		// When the term changes, switch to a new search Observable.
		switchMap((term: string) => this.heroService.searchHeroes(term))
	);
  }

  // Push a search term into the Observable stream
  search(term: string): void {
    this.searchTerms.next(term);
  }
}
