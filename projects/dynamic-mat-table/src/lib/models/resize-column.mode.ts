import { Subject } from 'rxjs';

export class ResizeColumn {
  startX: number;
  startWidth: number;
  isResizingRight: boolean;
  columnIndex: number;
  resizeHandler?: 'left' | 'right' = null;
  public widthUpdate: Subject<{i: number, w: number}> = new Subject<{i: number, w: number}>();
}
