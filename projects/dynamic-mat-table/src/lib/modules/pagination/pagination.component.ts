import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageConfigModel } from "./page-config.model";

@Component({
  selector: 'pagination[config]',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit
{
  @Input('config') set config(data: PageConfigModel)
  {
    console.log(data);

    if (data.pageIndex)
    {
      this._config.pageIndex = data.pageIndex;
    }

    if (data.previousPageIndex)
    {
      this._config.previousPageIndex = data.previousPageIndex;
    }

    if (data.dir)
    {
      this._config.dir = data.dir;
    }

    if (data.pageSize)
    {
      this._config.pageSize = data.pageSize;
    }

    if (data.previousLabel)
    {
      this._config.previousLabel = data.previousLabel;
    }
    if (data.nextLabel)
    {
      this._config.nextLabel = data.nextLabel;
    }

    if (data.firstLabel)
    {
      this._config.firstLabel = data.firstLabel;
    }

    if (data.lastLabel)
    {
      this._config.lastLabel = data.lastLabel;
    }

    if (data.length)
    {
      this._config.length = data.length;
    }

    if (data.pageSizeOptions)
    {
      this._config.pageSizeOptions = data.pageSizeOptions;
      if (!data.pageSizeOptions.includes(data.pageSize) && data.pageSizeOptions.length > 0)
      {
        this._config.pageSize = data.pageSizeOptions[0];
      }
    }
  };


  @Output('page') pageChange: EventEmitter<PageConfigModel> = new EventEmitter<PageConfigModel>();

  _config: PageConfigModel = new PageConfigModel();

  id = new Date().getTime();

  constructor()
  {
  }

  ngOnInit(): void
  {
  }

  goFirst()
  {
    this._config.pageIndex = 1;
    this.pageChange.emit({ ...this._config });
  }

  goLast()
  {
    this._config.pageIndex = Math.ceil(this._config.length / this._config.pageSize);
    this.pageChange.emit({ ...this._config })
  }

  next()
  {
    if (this._config.pageIndex! < Math.ceil(this._config.length / this._config.pageSize))
    {
      this._config.pageIndex!++;
      this.pageChange.emit({ ...this._config });
    }
  }

  previous()
  {
    if (this._config.pageIndex! > 1)
    {
      this._config.pageIndex!--;
      this.pageChange.emit({ ...this._config });
    }
  }

  goToPage(event: any)
  {
    if (event.target.value > 0 && event.target.value <= Math.ceil(this._config.length / this._config.pageSize))
    {
      this._config.pageIndex = event.target.value;
    } else if (event.target.value > Math.ceil(this._config.length / this._config.pageSize))
    {
      this._config.pageIndex = Math.ceil(this._config.length / this._config.pageSize);
    } else if (event.target.value < 1)
    {
      this._config.pageIndex = 1;
    }
    this.pageChange.emit({ ...this._config });
  }

  reset(event: any)
  {
    this._config.pageIndex = 1;
    this.pageChange.emit({ ...this._config });
  }

  get pageCount()
  {
    return Math.ceil(this._config.length / this._config.pageSize)
  }
}
