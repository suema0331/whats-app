import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AngularFirestore} from '@angular/fire/firestore';
import {CommonService, RoomData} from '../../../services/common.service';
import {map} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  randomSeed: any[] = [];
  roomData: RoomData[] = [];
  lastMessage: string;
  subs: Subscription[] = [];
  @Output()
  seedValue: EventEmitter<string> = new EventEmitter<string>();

  constructor(private afs: AngularFirestore,
              private commonService: CommonService
  ) { }

  ngOnInit(): void {
    // generate a random values  and store it in the randomSeed array
    this.randomSeed = Array.from({length: 20}, () => Math.floor(Math.random() * 14578976));

    // Fetching data from firestore
    // valueChangesは値のみ取ってくる
    // snapshotChangesはIDも取ってくる
    // 両方観察可能
    this.subs.push(this.afs.collection('rooms').snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map( a => {
            return {
              id: a.payload.doc.id,
              // @ts-ignore
              ...a.payload.doc.data()
            };
          });
        })
      ).subscribe((rooms: RoomData[]) => {
        this.roomData = rooms;
        console.log(this.roomData);
    }));
  }

  onFormSubmit(form: NgForm): void {
    const {search} = form.value;
    console.log(search);

    if (form.invalid) {
      return;
    }

    this.afs.collection<RoomData>('rooms')
      .valueChanges()
      .pipe(
        map((data: RoomData[]) => data.map(s => s.name?.toLowerCase() === form.value.search?.toLowerCase()))
      )
      .subscribe(dataValue => {
        dataValue = dataValue.filter(s => s === true);

        if (dataValue.length > 0) {
          form.resetForm();
          alert('Sorry, room already present');
          return;
        } else {
          if (form.value.search !== null && form.value.search !== '' ) {
            this.afs.collection('rooms').add({
              name: form.value.search
            });
          } else {
            return;
          }
          form.resetForm();
        }
      });


  }

  ngOnDestroy(): void {
    this.subs.map(s => s.unsubscribe());
  }

  seedData(ev: string): void {
    this.seedValue.emit(ev);
  }

  logout(): void {
    this.commonService.logout();
  }
}
