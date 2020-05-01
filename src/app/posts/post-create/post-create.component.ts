import { Component } from '@angular/core';
import { NgForm } from '@angular/forms'

import { PostsService } from '../post.service'

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  enteredContent = ''
  enteredTitle= ''
  insertTitleLabel = 'Post Title'
  insertContentLabel = 'Post Content'
  errorTitleLabel = 'Please inser a valid title'
  errorContentLabel = 'Please inser a valid title'

  constructor (public postsService: PostsService) {}

  onAddPost (form: NgForm) {
    if (form.invalid) {
      return
    }
    this.postsService.addPost(form.value.title, form.value.content)
  }
}
