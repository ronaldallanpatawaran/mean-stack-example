import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { PostListComponent } from './post-list.component';
import { AppComponent } from '../../app.component';

describe('PostListComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule
      ],
      declarations: [
        AppComponent,
        PostListComponent
      ],
    }).compileComponents();
  }));

  it('should create the component', () => {
    const fixture = TestBed.createComponent(PostListComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have property posts', () => {
    const fixture = TestBed.createComponent(PostListComponent);
    const app = fixture.componentInstance;
    expect(app.posts).toBeTruthy();
  });

  it('should have property noPostYetMessage', () => {
    const fixture = TestBed.createComponent(PostListComponent);
    const app = fixture.componentInstance;
    expect(app.noPostYetMessage).toBeTruthy();
  });

  it('should have property buttonEditTxt', () => {
    const fixture = TestBed.createComponent(PostListComponent);
    const app = fixture.componentInstance;
    expect(app.buttonDeleteTxt).toBeTruthy();
  });

  it('should have property buttonEditTxt', () => {
    const fixture = TestBed.createComponent(PostListComponent);
    const app = fixture.componentInstance;
    expect(app.buttonEditTxt).toBeTruthy();
  });

})
