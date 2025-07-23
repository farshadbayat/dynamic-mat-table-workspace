import { ElementRef } from "@angular/core";
// import { ElementRef } from "@angular/core";

// export function requestFullscreen(element: ElementRef) {
//     if (element.nativeElement.requestFullscreen) {
//       element.nativeElement.requestFullscreen();
//     } else if (element.nativeElement.webkitRequestFullscreen) { /* Safari */
//       element.nativeElement.webkitRequestFullscreen();
//     } else if (element.nativeElement.msRequestFullscreen) { /* IE11 */
//       element.nativeElement.msRequestFullscreen();
//     }
//   }

export function toggleFullscreen(element: ElementRef) {
  if (isFullscreen()) {
    exitFullscreen();
  } else {
    requestFullscreen(element);
  }
}

export function requestFullscreen(element: ElementRef) {
  if (element.nativeElement.requestFullscreen) {
    element.nativeElement.requestFullscreen();
  } else if (element.nativeElement.webkitRequestFullscreen) { /* Safari */
    element.nativeElement.webkitRequestFullscreen();
  } else if (element.nativeElement.msRequestFullscreen) { /* IE11 */
    element.nativeElement.msRequestFullscreen();
  }
}

export function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if ((document as any).webkitExitFullscreen) { /* Safari */
    (document as any).webkitExitFullscreen();
  } else if ((document as any).msExitFullscreen) { /* IE11 */
    (document as any).msExitFullscreen();
  }
}

export function isFullscreen(): boolean {
  return !!(document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).msFullscreenElement);
}