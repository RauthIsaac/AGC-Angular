import { Component } from '@angular/core';
import { Header } from '../../../../Shared/header/header';
import { HeroSection } from '../hero-section/hero-section';
import { Footer } from '../../../../Shared/footer/footer';
import { About } from '../about/about';
import { Contact } from '../contact/contact';
import { Ceo } from "../ceo/ceo";

@Component({
  selector: 'app-home',
  imports: [Header, Footer, HeroSection, About, Contact, Ceo],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {

}
