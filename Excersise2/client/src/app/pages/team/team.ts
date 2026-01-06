import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-team',
  imports: [],
  templateUrl: './team.html',
})
export class Team implements OnInit, OnDestroy {
    ngOnInit(): void {
    document.body.classList.add('team-page');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('team-page');
  }
}
