import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-team',
  imports: [],
  templateUrl: './team.html',
})
export class Team implements OnInit, OnDestroy {
  /**
   * Lifecycle hook: runs when the component is created.
   * We add a page-specific class on <body> so CSS can target this page only
   * (e.g., unique background, spacing, hero styling).
   */
  ngOnInit(): void {
    document.body.classList.add('team-page');
  }

  /**
   * Lifecycle hook: runs right before the component is destroyed
   * (e.g., when navigating away).
   * We remove the body class to avoid affecting other pages.
   */
  ngOnDestroy(): void {
    document.body.classList.remove('team-page');
  }
}
