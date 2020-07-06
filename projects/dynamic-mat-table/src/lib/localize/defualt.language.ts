import { LanguagePack } from '../models/language-pack.model';

export class DefualtLanguage implements LanguagePack {
  Table: import('../models/language-pack.model').Table =
  {
    NoData: 'No records found.'
  };
  Filter: import('../models/language-pack.model').Filter = {
    Clear: 'Clear',
    Search: 'Search',
    And: 'And',
    Or: 'Or',
    /* Text Compare */
    Text: 'Text',
    TextContains: 'Contains',
    TextEmpty: 'Empty',
    TextStartsWith: 'Starts With',
    TextEndsWith: 'Ends With',
    TextEquals: 'Equals',
    TextNotEmpty: 'Not Empty',
    /* Number Compare */
    Number: 'Number',
    NumberEquals: 'Equals',
    NumberNotEquals: 'Not Equals',
    NumberGreaterThan: 'Greater Than',
    NumberLessThan: 'Less Than',
    NumberEmpty: 'Empty',
    NumberNotEmpty: 'Not Empty',
    /* Category List Compare */
    /* Boolean Compare */
    /* Date Compare */
  };


}


