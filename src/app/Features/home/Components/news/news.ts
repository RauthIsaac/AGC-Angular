import { Component, input, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NewsCard } from '../../../news/news-card/news-card';

@Component({
  selector: 'app-news',
  imports: [NewsCard],
  templateUrl: './news.html',
  styleUrls: ['./news.css']
})
export class News implements OnChanges{

  // Input properties - receive data from parent
  @Input() siteData: any = null;
  @Input() currentLanguage: string = 'en';
  @Input() isRTL: boolean = false;
  @Input() isLoading: boolean = false;

  newsList: any[] = [];

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['siteData'] && changes['siteData'].currentValue) {
      console.log("Site Data changed:", changes['siteData'].currentValue);
      this.getNewsList();
    }
  }

  getNewsList(){
    console.log('Raw siteData:', this.siteData); 
    
    if(this.siteData){
        if(Array.isArray(this.siteData)) {
            const newsData = this.siteData.find(item => item.news);
            this.newsList = newsData ? newsData.news : [];
        } 
        else if(this.siteData.news) {
            this.newsList = this.siteData.news;
        }
        else if(Array.isArray(this.siteData) && this.siteData[0]?.title) {
            this.newsList = this.siteData;
        }
        else {
            this.newsList = [];
        }
        
        console.log('Final News List:', this.newsList);
    } else {
        this.newsList = [];
        console.log('No news data available.');
    }
}

}
