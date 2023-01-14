import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { IonAccordionGroup } from '@ionic/angular';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { City, PickerCityState } from '../../models/picker';

@Component({
  selector: 'app-picker-city',
  templateUrl: './picker-city.component.html',
  styleUrls: ['../picker/picker.component.scss'],
})
export class PickerCityComponent implements OnInit {
  /**
   * @description State of the component
   */
  @Input() state!: PickerCityState;
  /**
   * @description Emit an event containing the state of the component
   */
  @Output() choosenItem = new EventEmitter<PickerCityState>();

  @ViewChild('accordionGroup', { static: true }) accordionGroup!: IonAccordionGroup;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (!this.state) {
      const defaultState: PickerCityState = {
        items: [],
        search: '',
      };
      this.state = defaultState;
    }
  }

  getItems$(city: string): Observable<City[]> {
    const url = `https://nominatim.openstreetmap.org/search?city=${city}&format=jsonv2`;
    return this.http.get<City[]>(url);
  }

  private setItems(callback?: Function) {
    this.getItems$(this.state.search).subscribe({
      next: (cities) => {
        for (const city of cities) {
          this.state.items.push(city);
        }
        if (callback) callback();
      },
      error: (err) => {
        console.log({ err });
      },
    });
  }

  emitValues() {
    this.choosenItem.emit(this.state);
  }

  onInputChange(e: Event) {
    const event = e as CustomEvent;
    const search: string = event.detail.value;
    const lowerCaseSearch = search.toLowerCase();
    this.state.search = lowerCaseSearch;
    this.state.items = [];
    if (search === '') {
      this.accordionGroup.value = [];
      return;
    }

    const callback = () => {
      if (this.state.items.length > 0) this.accordionGroup.value = ['first'];
    };
    this.setItems(callback);
  }

  onCheck(city: City) {
    const coordinates = { lat: city.lat, lon: city.lon };
    console.log({ coordinates });
    this.accordionGroup.value = [];
    this.emitValues();
  }
}
