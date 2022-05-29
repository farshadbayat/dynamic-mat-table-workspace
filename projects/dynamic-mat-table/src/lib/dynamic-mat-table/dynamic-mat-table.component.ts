import {
  Component,
  OnInit,
  AfterViewInit,
  QueryList,
  ElementRef,
  ViewChild,
  TemplateRef,
  Renderer2,
  ChangeDetectorRef,
  Input,
  OnDestroy,
  ContentChildren,
  Injector,
  ComponentRef,
  HostBinding,
  ChangeDetectionStrategy,
} from "@angular/core";
import { TableCoreDirective } from "../cores/table.core.directive";
import { TableService } from "./dynamic-mat-table.service";
import { TableRow } from "../models/table-row.model";
import { TableField } from "../models/table-field.model";
import { AbstractFilter } from "./extensions/filter/compare/abstract-filter";
import { HeaderFilterComponent } from "./extensions/filter/header-filter.component";
import { MatDialog } from "@angular/material/dialog";
import { PrintTableDialogComponent } from "./extensions/print-dialog/print-dialog.component";
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
  state,
} from "@angular/animations";
import { ResizeColumn } from "../models/resize-column.mode";
import { TableIntl } from "../international/table-Intl";
import { TableMenuActionChange } from "./extensions/table-menu/table-menu.component";
import {
  CdkDragDrop,
  CdkDragStart,
  moveItemInArray,
} from "@angular/cdk/drag-drop";
import { isNullorUndefined } from "../cores/type";
import { SettingItem, TableSetting } from "../models/table-setting.model";
import { delay, filter } from "rxjs/operators";
import { FixedSizeTableVirtualScrollStrategy } from "../cores/fixed-size-table-virtual-scroll-strategy";
import { Subscription } from "rxjs";
import { MatMenuTrigger } from "@angular/material/menu";
import { ContextMenuItem } from "../models/context-menu.model";
import {
  Overlay,
  OverlayContainer,
  OverlayPositionBuilder,
  OverlayRef,
} from "@angular/cdk/overlay";
import { requestFullscreen } from "../utilies/html.helper";
import { TooltipComponent } from "../tooltip/tooltip.component";
import { ComponentPortal } from "@angular/cdk/portal";
import { PageEvent } from "@angular/material/paginator";

export const tableAnimation = trigger("tableAnimation", [
  transition("void => *", [
    query(":enter", style({ transform: "translateX(-50%)", opacity: 0 }), {
      //limit: 5,
      optional: true,
    }),
    query(
      ":enter",
      stagger("0.01s", [
        animate(
          "0.5s ease",
          style({ transform: "translateX(0%)", opacity: 1 })
        ),
      ]),
      {
        //limit: 5,
        optional: true,
      }
    ),
  ]),
]);

export const expandAnimation = trigger("detailExpand", [
  state("collapsed", style({ height: "0px", minHeight: "0" })),
  state("expanded", style({ height: "*" })),
  transition(
    "expanded <=> collapsed",
    animate("100ms cubic-bezier(0.4, 0.0, 0.2, 1)")
  ),
]);

@Component({
  // tslint:disable-next-line: component-selector
  selector: "dynamic-mat-table",
  templateUrl: "./dynamic-mat-table.component.html",
  styleUrls: ["./dynamic-mat-table.component.scss"],
  animations: [tableAnimation, expandAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicMatTableComponent<T extends TableRow>
  extends TableCoreDirective<T>
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild("tbl", { static: true }) tbl;
  @Input()
  get setting() {
    return this.tableSetting;
  }
  set setting(value: TableSetting) {
    if (!isNullorUndefined(value)) {
      value.alternativeRowStyle =
        value.alternativeRowStyle || this.tableSetting.alternativeRowStyle;
      value.columnSetting =
        value.columnSetting || this.tableSetting.columnSetting;
      value.direction = value.direction || this.tableSetting.direction;
      value.normalRowStyle =
        value.normalRowStyle || this.tableSetting.normalRowStyle;
      value.visibaleActionMenu =
        value.visibaleActionMenu || this.tableSetting.visibaleActionMenu;
      value.visibleTableMenu =
        value.visibleTableMenu || this.tableSetting.visibleTableMenu;
      value.autoHeight = value.autoHeight || this.tableSetting.autoHeight;
      value.saveSettingMode =
        value.saveSettingMode || this.tableSetting.saveSettingMode || "simple";
      this.pagination.pageSize = value.pageSize || this.tableSetting.pageSize;
      /* Dynamic Cell must update when setting change */
      value?.columnSetting?.forEach((column) => {
        const orginalColumn = this.columns?.find((c) => c.name === column.name);
        if (orginalColumn) {
          column = { ...orginalColumn, ...column };
        }
      });
      this.tableSetting = value;
      this.setDisplayedColumns();
    }
  }
  init = false;

  @HostBinding("style.height.px") height = null;

  @ViewChild("tooltip") tooltipRef!: TemplateRef<any>;
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  public contextMenuPosition = { x: "0px", y: "0px" };
  @ViewChild("printRef", { static: true }) printRef!: TemplateRef<any>;
  @ViewChild("printContentRef", { static: true }) printContentRef!: ElementRef;
  @ContentChildren(HeaderFilterComponent)
  headerFilterList!: QueryList<HeaderFilterComponent>;
  private dragDropData = { dragColumnIndex: -1, dropColumnIndex: -1 };
  private eventsSubscription: Subscription;
  printing = true;
  printTemplate: TemplateRef<any> = null;
  public resizeColumn: ResizeColumn = new ResizeColumn();
  /* mouse resize */
  resizableMousemove: () => void;
  resizableMouseup: () => void;
  /* Tooltip */
  overlayRef: OverlayRef = null;

  constructor(
    public dialog: MatDialog,
    private renderer: Renderer2,
    public languagePack: TableIntl,
    public tableService: TableService,
    public cdr: ChangeDetectorRef,
    public overlay: Overlay,
    private overlayContainer: OverlayContainer,
    private overlayPositionBuilder: OverlayPositionBuilder
  ) {
    super(tableService, cdr);
    this.overlayContainer
      .getContainerElement()
      .addEventListener("contextmenu", (e) => {
        e.preventDefault();
        return false;
      });

    this.eventsSubscription = this.resizeColumn.widthUpdate
      .pipe(
        delay(150),
        filter((data) => data.e.columnIndex >= 0) /* Checkbox Column */
      )
      .subscribe((data) => {
        let i = data.e.columnIndex;
        if (data.e.resizeHandler === "left") {
          const visibleColumns = this.columns.filter(
            (c) => c.display !== "hiden" && c.index < data.e.columnIndex
          );
          i = visibleColumns[visibleColumns.length - 1].index;
        }
        this.columns[i].width = data.w;
        const unit = this.columns[i].widthUnit || "px";
        const style =
          unit === "px" ? data.w + "px" : `calc(100% - ${data.w}px)`;
        this.columns[i].style = {
          ...this.columns[i].style,
          "max-width": style,
          "min-width": style,
        };

        /* store latest width in setting if exsis */
        if (this.tableSetting.columnSetting[i]) {
          this.tableSetting.columnSetting[i].width = data.w;
        }
        this.refreshGrid();
      });
  }

  ngAfterViewInit(): void {
    this.tvsDataSource.paginator = this.paginator;
    this.tvsDataSource.sort = this.sort;
    this.dataSource.subscribe((x) => {
      x = x || [];
      this.rowSelectionModel.clear();
      this.tvsDataSource.data = [];
      this.initSystemField(x);
      this.tvsDataSource.data = x;
      // this.cdr.detectChanges();
      this.refreshUI();
      // window.requestAnimationFrame(() => {
      // });
    });

    this.tvsDataSource.sort.sortChange.subscribe((sort) => {
      this.pagination.pageIndex = 0;
      this.onTableEvent.emit({ event: "SortChanged", sender: sort });
    });
  }

  tooltip_onChanged(
    column: TableField<T>,
    row: any,
    elementRef: any,
    show: boolean
  ) {
    if (column.cellTooltipEnable === true) {
      if (show === true && row[column.name]) {
        if (this.overlayRef !== null) {
          this.closeTooltip();
        }

        const positionStrategy = this.overlayPositionBuilder
          .flexibleConnectedTo(elementRef)
          .withPositions([
            {
              originX: "center",
              originY: "top",
              overlayX: "center",
              overlayY: "bottom",
              offsetY: -8,
            },
          ]);

        this.overlayRef = this.overlay.create({ positionStrategy });
        const injector = Injector.create([
          {
            provide: "tooltipConfig",
            useValue: row[column.name],
          },
        ]);
        const tooptipRef: ComponentRef<TooltipComponent> =
          this.overlayRef.attach(
            new ComponentPortal(TooltipComponent, null, injector)
          );
      } else if (show === false && this.overlayRef !== null) {
        this.closeTooltip();
      }
    }
  }

  closeTooltip() {
    this.overlayRef?.detach();
    this.overlayRef = null;
  }
  ellipsis(column: TableField<T>, cell: boolean = true) {
    if (cell === true && column.cellEllipsisRow > 0) {
      return {
        display: "-webkit-box",
        "-webkit-line-clamp": column?.cellEllipsisRow,
        "-webkit-box-orient": "vertical",
        overflow: "hidden",
        "white-space": "pre-wrap",
      };
    } else if (cell === true && column.headerEllipsisRow > 0) {
      return {
        display: "-webkit-box",
        "-webkit-line-clamp": column?.headerEllipsisRow,
        "-webkit-box-orient": "vertical",
        overflow: "hidden",
        "white-space": "pre-wrap",
      };
    }
  }

  indexTrackFn = (index: number) => {
    return index;
  };

  trackColumn(index: number, item: TableField<T>): string {
    return `${item.index}`;
  }

  ngOnDestroy(): void {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }

  public refreshUI() {
    if (this.tableSetting.autoHeight === true) {
      this.height = this.autoHeight();
    } else {
      this.height = null;
    }
    this.refreshColumn(this.tableColumns);
    const scrollStrategy: FixedSizeTableVirtualScrollStrategy =
      this.viewport["_scrollStrategy"];
    scrollStrategy?.viewport?.checkViewportSize();
    scrollStrategy?.viewport?.scrollToOffset(0);
    this.cdr.detectChanges();
  }

  ngOnInit() {
    setTimeout(() => {
      this.init = true;
    }, 1000);
    const scrollStrategy: FixedSizeTableVirtualScrollStrategy =
      this.viewport["_scrollStrategy"];

    scrollStrategy.offsetChange.subscribe((offset) => {});
    this.viewport.renderedRangeStream.subscribe((t) => {
      // in expanding row scrolling make not good apperance therefor close it.
      if (
        this.expandedElement &&
        this.expandedElement.option &&
        this.expandedElement.option.expand
      ) {
        // this.expandedElement.option.expand = false;
        // this.expandedElement = null;
      }
    });
  }

  public get inverseOfTranslation(): number {
    if (!this.viewport || !this.viewport["_renderedContentOffset"]) {
      return -0;
    }
    let offset = this.viewport["_renderedContentOffset"];
    return -offset;
  }

  headerClass(column: TableField<T>) {
    return column?.classNames;
  }

  rowStyle(row) {
    let style: any = row?.option?.style || {};
    if (this.setting.alternativeRowStyle && row.id % 2 === 0) {
      // style is high priority
      style = { ...this.setting.alternativeRowStyle, ...style };
    }
    if (this.setting.rowStyle) {
      style = { ...this.setting.rowStyle, ...style };
    }
    return style;
  }

  cellClass(option, column) {
    let clas = null;
    if (option && column.name) {
      clas = option[column.name] ? option[column.name].style : null;
    }

    if (clas === null) {
      return column.cellClass;
    } else {
      return { ...clas, ...column.cellClass };
    }
  }

  cellStyle(option, column) {
    let style = null;
    if (option && column.name) {
      style = option[column.name] ? option[column.name].style : null;
    }
    /* consider to column width resize */
    if (style === null) {
      return { ...column.cellStyle, ...column.style };
    } else {
      return { ...style, ...column.cellStyle, ...column?.style };
    }
  }

  cellIcon(option, cellName) {
    if (option && cellName) {
      return option[cellName] ? option[cellName].icon : null;
    } else {
      return null;
    }
  }

  filter_onChanged(column: TableField<T>, filter: AbstractFilter[]) {
    this.pending = true;
    this.tvsDataSource.setFilter(column.name, filter).subscribe(() => {
      this.clearSelection();
      this.pending = false;
    });
  }

  currentContextMenuSender: any = {};
  onContextMenu(event: MouseEvent, column: TableField<T>, row: any) {
    if (
      this.currentContextMenuSender?.time &&
      new Date().getTime() - this.currentContextMenuSender.time < 500
    ) {
      return;
    }
    this.contextMenu.closeMenu();
    if (this.contextMenuItems?.length === 0) {
      return;
    }
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + "px";
    this.contextMenuPosition.y = event.clientY + "px";
    this.currentContextMenuSender = {
      column: column,
      row: row,
      time: new Date().getTime(),
    };
    this.contextMenu.menuData = this.currentContextMenuSender;
    this.contextMenu.menu.focusFirstItem("mouse");
    this.onRowEvent.emit({
      event: "BeforContextMenuOpen",
      sender: { row: row, column: column, contextMenu: this.contextMenuItems },
    });
    this.contextMenu.openMenu();
  }

  onContextMenuItemClick(data: ContextMenuItem) {
    this.contextMenu.menuData.item = data;
    this.onRowEvent.emit({
      event: "ContextMenuClick",
      sender: this.contextMenu.menuData,
    });
  }

  tableMenuActionChange(e: TableMenuActionChange) {
    if (e.type === "TableSetting") {
      // this.saveSetting(e.data, null, false);
      this.settingChange.emit({ setting: this.tableSetting });
      this.refreshColumn(this.tableSetting.columnSetting);
    } else if (e.type === "DefaultSetting") {
      (this.setting.settingList || []).forEach((setting) => {
        if (setting.settingName === e.data) {
          setting.isDefaultSetting = true;
        } else {
          setting.isDefaultSetting = false;
        }
      });
    } else if (e.type === "SaveSetting") {
      const newSetting = Object.assign({}, this.setting);
      delete newSetting.settingList;
      newSetting.settingName = e.data;
      const settingIndex = (this.setting.settingList || []).findIndex(
        (f) => f.settingName === e.data
      );
      if (settingIndex === -1) {
        this.setting.settingList.push(JSON.parse(JSON.stringify(newSetting)));
        this.settingChange.emit({ setting: this.tableSetting });
      } else {
        this.setting.settingList[settingIndex] = JSON.parse(
          JSON.stringify(newSetting)
        );
        this.settingChange.emit({ setting: this.tableSetting });
      }
    } else if (e.type === "DeleteSetting") {
      this.setting.settingList = this.setting.settingList.filter(
        (s) => s.settingName !== e.data.settingName
      );
      this.settingChange.emit({ setting: this.tableSetting });
    } else if (e.type === "SelectSetting") {
      let setting: SettingItem = null;
      this.setting.settingList.forEach((s) => {
        if (s.settingName === e.data) {
          s.isCurrentSetting = true;
          setting = Object.assign(
            {},
            this.setting.settingList.find((s) => s.settingName === e.data)
          );
        } else {
          s.isCurrentSetting = false;
        }
      });
      setting.settingList = this.setting.settingList;
      delete setting.isCurrentSetting;
      delete setting.isDefaultSetting;
      if (this.pagination.pageSize !== setting?.pageSize) {
        this.pagination.pageSize =
          setting?.pageSize || this.pagination.pageSize;
        this.paginationChange.emit(this.pagination);
      }
      /* Dynamic Cell must update when setting change */
      setting.columnSetting?.forEach((column) => {
        const orginalColumn = this.columns.find((c) => c.name === column.name);
        column = { ...orginalColumn, ...column };
      });
      this.tableSetting = setting;
      this.settingChange.emit({ setting: this.tableSetting });
      // this.refreshColumn(this.tableSetting.columnSetting);
    } else if (e.type === "FullScreenMode") {
      requestFullscreen(this.tbl.elementRef);
    } else if (e.type === "Download") {
      if (e.data === "CSV") {
        this.tableService.exportToCsv<T>(
          this.columns,
          this.tvsDataSource.filteredData,
          this.rowSelectionModel
        );
      } else if (e.data === "JSON") {
        this.tableService.exportToJson(this.tvsDataSource.filteredData);
      }
    } else if (e.type === "FilterClear") {
      this.tvsDataSource.clearFilter();
      this.headerFilterList.forEach((hf) => hf.clearColumn_OnClick());
    } else if (e.type === "Print") {
      this.printConfig.displayedFields = this.columns
        .filter((c) => isNullorUndefined(c.printable) || c.printable === true)
        .map((o) => o.name);
      this.printConfig.title = this.printConfig.title || this.tableName;
      this.printConfig.direction = this.tableSetting.direction || "ltr";
      this.printConfig.columns = this.tableColumns;
      this.printConfig.data = this.tvsDataSource.filteredData;
      debugger;
      const params = this.tvsDataSource.toTranslate();
      this.printConfig.tablePrintParameters = [];
      params.forEach((item) => {
        this.printConfig.tablePrintParameters.push(item);
      });

      this.dialog.open(PrintTableDialogComponent, {
        width: "90vw",
        data: this.printConfig,
      });
    }
  }

  rowMenuActionChange(contextMenuItem: ContextMenuItem, row: any) {
    this.onRowEvent.emit({
      event: "RowActionMenu",
      sender: { row: row, action: contextMenuItem },
    });
    // this.rowActionMenuChange.emit({actionItem: contextMenuItem, rowItem: row });
  }

  pagination_onChange(e: PageEvent) {
    if (this.pagingMode !== "none") {
      this.pending = true;
      this.tvsDataSource.refreshFilterPredicate();
      this.pagination.length = e.length;
      this.pagination.pageIndex = e.pageIndex;
      this.pagination.pageSize = e.pageSize;
      this.setting.pageSize =
        e.pageSize; /* Save Page Size when need in setting config */
      this.paginationChange.emit(this.pagination);
    }
  }

  autoHeight() {
    const minHeight =
      this.headerHeight +
      (this.rowHeight + 1) * this.dataSource.value.length +
      this.footerHeight * 0;
    return minHeight.toString();
  }

  reload_onClick() {
    this.onTableEvent.emit({ sender: null, event: "ReloadData" });
  }

  /////////////////////////////////////////////////////////////////

  onResizeColumn(event: MouseEvent, index: number, type: "left" | "right") {
    console.log(type);

    this.resizeColumn.resizeHandler = type;
    this.resizeColumn.startX = event.pageX;
    if (this.resizeColumn.resizeHandler === "right") {
      this.resizeColumn.startWidth = (
        event.target as Node
      ).parentElement.clientWidth;
      this.resizeColumn.columnIndex = index;
    } else {
      if (
        (event.target as Node).parentElement.previousElementSibling === null
      ) {
        /* for first column not resize */
        return;
      } else {
        this.resizeColumn.startWidth = (
          event.target as Node
        ).parentElement.previousElementSibling.clientWidth;
        this.resizeColumn.columnIndex = index;
      }
    }
    event.preventDefault();
    this.mouseMove(index);
  }

  mouseMove(index: number) {
    this.resizableMousemove = this.renderer.listen(
      "document",
      "mousemove",
      (event) => {
        if (this.resizeColumn.resizeHandler !== null && event.buttons) {
          const rtl = this.direction === "rtl" ? -1 : 1;
          let width = 0;
          if (this.resizeColumn.resizeHandler === "right") {
            const dx = event.pageX - this.resizeColumn.startX;
            width = this.resizeColumn.startWidth + rtl * dx;
          } else {
            const dx = this.resizeColumn.startX - event.pageX;
            width = this.resizeColumn.startWidth - rtl * dx;
          }
          if (
            this.resizeColumn.columnIndex === index &&
            width > this.minWidth
          ) {
            // debugger
            // this.resizeColumn.columnIndex = index;
            this.resizeColumn.widthUpdate.next({
              e: this.resizeColumn,
              w: width,
            });
          }
        }
      }
    );
    this.resizableMouseup = this.renderer.listen(
      "document",
      "mouseup",
      (event) => {
        if (this.resizeColumn.resizeHandler !== null) {
          this.resizeColumn.resizeHandler = null;
          this.resizeColumn.columnIndex = -1;
          /* fix issue sticky column */
          this.table.updateStickyColumnStyles();
          /* Remove Event Listen */
          this.resizableMousemove();
        }
      }
    );
  }

  public expandRow(rowIndex: number, mode: boolean = true) {
    if (rowIndex === null || rowIndex === undefined) {
      throw "Row index is not defined.";
    }
    if (this.expandedElement === this.tvsDataSource.allData[rowIndex]) {
      this.expandedElement.option.expand = mode;
      this.expandedElement =
        this.expandedElement === this.tvsDataSource.allData[rowIndex]
          ? null
          : this.tvsDataSource.allData[rowIndex];
    } else {
      if (
        this.expandedElement &&
        this.expandedElement !== this.tvsDataSource.allData[rowIndex]
      ) {
        this.expandedElement.option.expand = false;
      }
      this.expandedElement = null;
      if (mode === true) {
        // this.viewport.scrollToIndex(rowIndex, 'smooth');
        // setTimeout( () => {
        //   this.expandedElement = this.expandedElement === this.dataSource.allData[rowIndex] ? null : this.dataSource.allData[rowIndex];
        //   if (this.expandedElement.option === undefined || this.expandedElement.option === null) {
        //     this.expandedElement.option = { expand: false};
        //   }
        //   this.expandedElement.option.expand = true;
        //   this.refreshGrid();
        // }, 300);
        this.expandedElement =
          this.expandedElement === this.tvsDataSource.allData[rowIndex]
            ? null
            : this.tvsDataSource.allData[rowIndex];
        if (
          this.expandedElement.option === undefined ||
          this.expandedElement.option === null
        ) {
          this.expandedElement.option = { expand: false };
        }
        this.expandedElement.option.expand = true;
      }
    }
  }

  onRowSelection(e, row, column: TableField<T>) {
    if (
      this.rowSelectionMode &&
      this.rowSelectionMode !== "none" &&
      column.rowSelectionable !== false
    ) {
      this.onRowSelectionChange(e, row);
    }
  }

  onCellClick(e, row, column: TableField<T>) {
    if (column.cellTooltipEnable === true) {
      this.closeTooltip(); /* Fixed BUG: Open Overlay when redirect to other route*/
      // this.openTooltip(e,1);
      // this.openTooltip(e?.srcElement);
      // this.tooltipText = e.srcElement.scrollHeight;
    }
    this.onRowSelection(e, row, column);
    if (
      column.clickable !== false &&
      (column.clickType === null || column.clickType === "cell")
    ) {
      this.onRowEvent.emit({
        event: "CellClick",
        sender: { row: row, column: column },
      });
    }
  }

  onLabelClick(e, row, column: TableField<T>) {
    if (column.clickable !== false && column.clickType === "label") {
      this.onRowEvent.emit({
        event: "LabelClick",
        sender: { row: row, column: column, e: e },
      });
    }
  }

  onRowDblClick(e, row) {
    this.onRowEvent.emit({ event: "DoubleClick", sender: { row: row, e: e } });
  }

  onRowClick(e, row) {
    this.onRowEvent.emit({ event: "RowClick", sender: { row: row, e: e } });
  }

  /************************************ Drag & Drop Column *******************************************/

  dragStarted(event: CdkDragStart) {
    // this.dragDropData.dragColumnIndex = event.source.;
  }

  dropListDropped(event: CdkDragDrop<string[]>) {
    if (event) {
      this.dragDropData.dropColumnIndex = event.currentIndex;
      this.moveColumn(event.previousIndex, event.currentIndex);
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    // updates moved data and table, but not dynamic if more dropzones
    // this.dataSource.data = clonedeep(this.dataSource.data);
  }
  /************************************  *******************************************/

  copyProperty(from: any, to: any) {
    const keys = Object.keys(from);
    keys.forEach((key) => {
      if (from[key] !== undefined && from[key] === null) {
        to[key] = Array.isArray(from[key])
          ? Object.assign([], from[key])
          : Object.assign({}, from[key]);
      }
    });
  }
}
