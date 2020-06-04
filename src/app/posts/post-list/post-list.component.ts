import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs'

import { Post, Paginator } from '../post.model';
import { PostsService } from '../post.service'
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'post-app-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  private postsSubs: Subscription
  private authStatusSubs: Subscription

  buttonEditTxt = 'Edit'
  buttonDeleteTxt = 'Delete'
  posts: Post[] = []
  noPostYetMessage = 'No post yet here.'
  isLoading = false
  postPerpage = 2
  currentPage = 1
  totalPosts = 0
  pageSizeOption = [1, 2, 5, 10]
  userId: string
  userIsAuthenticated = false

  constructor (
    public postsService: PostsService,
    private authService: AuthService
    ) {}

  ngOnInit () {
    this.isLoading = true
    this.postsService.getPosts(this.currentPage, this.postPerpage)
    this.userId = this.authService.getUserId()
    this.postsSubs = this.postsService.getPostUpdateListener()
      .subscribe((postData: { posts: Post[], postCount: number })=> {
        this.isLoading = false
        this.totalPosts = postData.postCount
        this.posts = postData.posts
      })
    this.userIsAuthenticated = this.authService.getIsAuth()
    this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated)=> {
        this.userIsAuthenticated = isAuthenticated
        this.userId = this.authService.getUserId()
      })
  }

  onDelete (id: string) {
    this.isLoading = true
    this.postsService.deletePost(id).subscribe(()=>{
      this.isLoading = false
      this.postsService.getPosts(this.currentPage, this.postPerpage)
    }, () => {
      this.isLoading = false
    })
  }

  onChangedPage (event: Paginator) {
    const pageSize = event.pageSize
    const currentPage = event.pageIndex + 1
    this.isLoading = true
    this.postsService.getPosts(currentPage, pageSize)
    this.postsSubs = this.postsService.getPostUpdateListener()
      .subscribe((postData: { posts: Post[], postCount: number })=> {
        this.isLoading = false
        this.posts = postData.posts
      }, ()=> {
        this.isLoading = false
      })
  }

  ngOnDestroy () {
    this.postsSubs.unsubscribe()
  }
}
