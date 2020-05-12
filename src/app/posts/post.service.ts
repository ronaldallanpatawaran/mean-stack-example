import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
import { map } from 'rxjs/operators'

import { Post } from './post.model'

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = []
  private postsUpdated = new Subject<Post[]>()
  private urlPath = 'http://localhost:3000/api/posts'

  constructor (private http: HttpClient, private router: Router) {}

  getPosts () {
    this.http.get<{ message: string, posts: any }>(this.urlPath)
      .pipe(map((postData)=> {
        return postData.posts.map(post => {
          return {
            id: post._id,
            title: post.title,
            content: post.content
          }
        })
      }))
      .subscribe((transformedPosts)=> {
        this.posts = transformedPosts
        this.postsUpdated.next([...this.posts])
      })
  }

  getPostUpdateListener () {
    return this.postsUpdated.asObservable()
  }

  getPost (id: string) {
    return this.http.get<{ message: string, posts: any }>(`${this.urlPath}/${id}`)
  }

  addPost (title: string, content: string, image: File) {
    const postData = new FormData()
    postData.append('title', title)
    postData.append('content', content)
    postData.append('image', image, title)
    const post: Post = { id: null, title, content }
    this.http.post<{ message: string, postId: string }>(this.urlPath, postData)
      .subscribe((responseData=> {
        const post: Post = {
          id: responseData.postId,
          title: title,
          content: content
        }
        this.posts.push(post)
        this.postsUpdated.next([...this.posts])
        this.router.navigate(['/'])
      }))
  }

  updatePost (id: string, title: string, content: string) {
    const post: Post = { id, title, content }
    this.http.patch<{ message: string, postId: string }>(`${this.urlPath}/${id}`, post)
    .subscribe((responseData=> {
      const updatedPosts = [...this.posts]
      const oldPostIndex = updatedPosts.findIndex(p=>p.id === post.id)
      updatedPosts[oldPostIndex] = post
      this.posts = updatedPosts
      this.postsUpdated.next([...this.posts])
      this.router.navigate(['/'])
    }))
  }

  deletePost (id: string) {
    this.http.delete<{ message: string, postId: string }>(`${this.urlPath}/${id}`)
      .subscribe((responseData=> {
        this.posts = this.posts.filter((postData)=> {
          return postData.id !== responseData.postId
        })
        this.postsUpdated.next([...this.posts])
      }))
  }

}
