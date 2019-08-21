'use strict';
/* global shoppingList, cuid */

// eslint-disable-next-line no-unused-vars
const store = {
  items: [
    { id: cuid(), name: 'apples', checked: false, renaming: false },
    { id: cuid(), name: 'oranges', checked: false, renaming: false },
    { id: cuid(), name: 'milk', checked: false, renaming: false },
    { id: cuid(), name: 'bread', checked: false, renaming: false }
  ],
  hideCheckedItems: false,
  searchTerm: ''
};

function main() {
  shoppingList.bindEventListeners();
  shoppingList.render();
}

$(main);
