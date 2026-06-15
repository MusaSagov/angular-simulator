import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPost } from '../interfaces/IPost';
import { LoaderService } from '../../../service/loader.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss'
})
export class PostDetailComponent implements OnInit {
  
  post: IPost | null = null;

  private route = inject(ActivatedRoute);
  private loaderService = inject(LoaderService);

  ngOnInit(): void {
    this.loaderService.showLoader();
    this.post = this.route.snapshot.data['post'];
    this.loaderService.hideLoader();
  }

}