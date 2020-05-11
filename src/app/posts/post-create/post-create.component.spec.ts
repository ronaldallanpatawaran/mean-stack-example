import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NgForm, NgModel } from '@angular/forms'

import { PostCreateComponent } from './post-create.component';
import { AppComponent } from '../../app.component';

describe('PostCreateComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule
      ],
      declarations: [
        AppComponent,
        PostCreateComponent,
        NgForm,
        NgModel
      ],
    }).compileComponents();
  }));

  it('should create the component', () => {
    const fixture = TestBed.createComponent(PostCreateComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have property function onSavePost', () => {
    const fixture = TestBed.createComponent(PostCreateComponent);
    const app = fixture.componentInstance;
    expect(app.onSavePost).toBeTruthy();
  });

  it('should have property function insertTitleLabel', () => {
    const fixture = TestBed.createComponent(PostCreateComponent);
    const app = fixture.componentInstance;
    expect(app.insertTitleLabel).toBeTruthy();
  });

  it('should have property function insertContentLabel', () => {
    const fixture = TestBed.createComponent(PostCreateComponent);
    const app = fixture.componentInstance;
    expect(app.insertContentLabel).toBeTruthy();
  });

  it('should have property function errorTitleLabel', () => {
    const fixture = TestBed.createComponent(PostCreateComponent);
    const app = fixture.componentInstance;
    expect(app.errorTitleLabel).toBeTruthy();
  });

  it('should have property function errorContentLabel', () => {
    const fixture = TestBed.createComponent(PostCreateComponent);
    const app = fixture.componentInstance;
    expect(app.errorContentLabel).toBeTruthy();
  });

})
