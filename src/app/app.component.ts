import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { GoogleSheetsDbService } from 'ng-google-sheets-db';

import { environment } from '../environments/environment';
import {
  Character,
  characterAttributesMapping,
} from './models/character.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  characters$: Observable<Character[]>;
  title: String = '';
  warning: String = '';

  filterForm = this.formBuilder.group({
    filter: '',
  });

  constructor(
    private googleSheetsDbService: GoogleSheetsDbService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.title = 'Welcome to our dictionary!';
    this.warning = '';
  }
  onSubmit(): void {
    // Process checkout data here
    console.log(this.filterForm.controls['filter'].value.length);
    var filter = this.filterForm.controls['filter'].value;

    if (this.filterForm.controls['filter'].value.length > 3) {
      this.warning = '';
      this.characters$ = this.googleSheetsDbService
        .getActive<Character>(
          environment.characters.spreadsheetId,
          environment.characters.worksheetName,
          characterAttributesMapping,
          'Active'
        )
        .pipe(
          map((items) => {
            items = items.filter((item) => {
              return (
                item.english.toLowerCase().includes(filter.toLowerCase()) ||
                item.german.toLowerCase().includes(filter.toLowerCase()) ||
                item.turkish.toLowerCase().includes(filter.toLowerCase())
              );
            });
            return items;
          })
        );
    } else {
      this.warning = 'arama yaparken lütfen en az 3 karakter giriniz';
    }
  }
}
