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
  errorTitleLabel = 'Please insert a valid title'
  errorContentLabel = 'Please insert a valid title'
  post: Post
  isLoading = false

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
        vm.isLoading = true
        this.postsService.getPost(vm.postId).subscribe(postData => {
          vm.isLoading = false
          this.post = { id: postData.posts._id, title: postData.posts.title, content: postData.posts.content }
        })
      } else {
        vm.mode = 'create'
        vm.postId = null
      }
    })
  }

  onSavePost (form: NgForm) {
    const vm = this
    if (form.invalid) {
      return
    }
    vm.isLoading = true
    if (vm.mode === 'create') {
      vm.postsService.addPost(form.value.title, form.value.content)
    } else {
      vm.postsService.updatePost(
        vm.postId,
        form.value.title,
        form.value.content
      )
    }
    form.resetForm()
  }
}
