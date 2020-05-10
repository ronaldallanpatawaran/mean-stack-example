import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'
import { ActivatedRoute } from '@angular/router';

import { PostsService } from '../post.service'
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  insertTitleLabel = 'Post Title'
  insertContentLabel = 'Post Content'
  errorTitleLabel = 'Please inser a valid title'
  errorContentLabel = 'Please inser a valid title'
  post: Post

  private mode = 'create'
  private postId: string

  constructor (
    public postsService: PostsService,
    public route: ActivatedRoute
    ) {}

  ngOnInit () {
    const vm = this
    vm.route.paramMap.subscribe((paramMap)=> {
      if (paramMap.has('postId')) {
        vm.mode = 'edit'
        vm.postId = paramMap.get('postId')
        vm.post = this.postsService.getPost(vm.postId)
      } else {
        vm.mode = 'create'
        vm.postId = null
      }
    })
  }

  onSavePost (form: NgForm) {
    if (form.invalid) {
      return
    }
    if (this.mode === 'create') {
      this.postsService.addPost(form.value.title, form.value.content)
    } else {
      this.postsService.updatePost(
        this.postId,
        form.value.title,
        form.value.content
      )
    }
    form.resetForm()
  }
}
