export interface LanguagePack {
  Table: Table;
  Filter: Filter;
}

export interface Table {
  NoData: string;
}

export interface Filter {
  Clear: string;
  Search: string;
  And: string;
  Or: string;
  /* Text Compare */
  Text: string;
  TextContains: string;
  TextEquals: string;
  TextStartsWith: string;
  TextEndsWith: string;
  TextEmpty: string;
  TextNotEmpty: string;
  /* Number Compare */
  Number: string;
  NumberEquals: string;
  NumberNotEquals: string;
  NumberGreaterThan: string;
  NumberLessThan: string;
  NumberEmpty: string;
  NumberNotEmpty: string;
  /* Category List Compare */
  /* Boolean Compare */
  /* Date Compare */
}
