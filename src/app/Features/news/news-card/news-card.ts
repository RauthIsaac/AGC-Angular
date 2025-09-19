import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-news-card',
  imports: [RouterLink],
  templateUrl: './news-card.html',
  styleUrls: ['./news-card.css']
})
export class NewsCard implements OnInit, OnChanges {

    @Input({ required: true }) news!: any;

    constructor() { }

    ngOnInit(): void {
      if(this.news){
        console.log('News data received in NewsCard:', this.news);
      }
    }

    ngOnChanges(changes: SimpleChanges) {
      if (changes['news'] && changes['news'].currentValue) {
        console.log('News data received in NewsCard:', this.news);
      }else{
        console.log('No news data available in NewsCard.');
      }
    }
  
}
