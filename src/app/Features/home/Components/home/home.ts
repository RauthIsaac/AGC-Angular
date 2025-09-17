import { Component } from '@angular/core';
import { Header } from '../../../../Shared/header/header';
import { HeroSection } from '../hero-section/hero-section';
import { Footer } from '../../../../Shared/footer/footer';
import { About } from '../about/about';
import { Contact } from '../contact/contact';

@Component({
  selector: 'app-home',
  imports: [Header, Footer, HeroSection , About , Contact],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {

}
