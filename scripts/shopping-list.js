'use strict';
/* global store, cuid */

// eslint-disable-next-line no-unused-vars
const shoppingList = (function(){

  function generateItemElement(item) {
    let itemTitle = `<span class="shopping-item shopping-item__checked">${item.name}</span>`;
    if (!item.checked) {
      itemTitle = `<span class='shopping-item'>${item.name}</span>`;
    }
    if (item.renaming) {
      itemTitle = `
        <form class="js-item-edit">
          <input class="shopping-item shopping-item-edit" type="text" value="${item.name}" />
          <button type='submit' class='update-button'><span class="button-label">Update name</span></button>
        </form>
      `;
    }
    return `
      <li class="js-item-element" data-item-id="${item.id}">
        ${itemTitle}
        <div class="shopping-item-controls">
          <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
          </button>
          <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
          </button>
          <button class="shopping-item-rename js-item-rename">
            <span class="button-label">rename</span>
          </button>
        </div>
      </li>`;
  }
  
  
  function generateShoppingItemsString(shoppingList) {
    const items = shoppingList.map((item) => generateItemElement(item));
    return items.join('');
  }
  
  
  function render() {
    // Filter item list if store prop is true by item.checked === false
    let items = [ ...store.items ];
    if (store.hideCheckedItems) {
      items = items.filter(item => !item.checked);
    }
  
    // Filter item list if store prop `searchTerm` is not empty
    if (store.searchTerm) {
      items = items.filter(item => item.name.includes(store.searchTerm));
    }
  
    // render the shopping list in the DOM
    console.log('`render` ran');
    const shoppingListItemsString = generateShoppingItemsString(items);
  
    // insert that HTML into the DOM
    $('.js-shopping-list').html(shoppingListItemsString);
  }
  
  
  function addItemToShoppingList(itemName) {
    store.items.push({ id: cuid(), name: itemName, checked: false });
    console.log(store);
  }
  
  function handleNewItemSubmit() {
    $('#js-shopping-list-form').submit(function (event) {
      event.preventDefault();
      const newItemName = $('.js-shopping-list-entry').val();
      
      $('.js-shopping-list-entry').val('');

      addItemToShoppingList(newItemName);
      render();
    });
  }
  
  function toggleCheckedForListItem(id) {
    const foundItem = store.items.find(item => item.id === id);
    foundItem.checked = !foundItem.checked;
  }
  
  function getItemIdFromElement(item) {
    return $(item)
      .closest('.js-item-element')
      .data('item-id');
  }
  
  function handleItemCheckClicked() {
    $('.js-shopping-list').on('click', '.js-item-toggle', event => {
      const id = getItemIdFromElement(event.currentTarget);
      toggleCheckedForListItem(id);
      render();
    });
  }
  
  function deleteListItem(id) {
    const index = store.items.findIndex(item => item.id === id);
    store.items.splice(index, 1);
  }
  
  function editListItemName(id, itemNewName) {
    const item = store.items.find(item => item.id === id);
    item.name = itemNewName;
    console.log(store);
  }
  
  function toggleCheckedItemsFilter() {
    store.hideCheckedItems = !store.hideCheckedItems;
  }
  
  function setSearchTerm(val) {
    store.searchTerm = val;
  }
  
  function toggleRenamingItem(id) {
    const foundItem = store.items.find(item => item.id === id);
    console.log(foundItem);
    foundItem.renaming = !foundItem.renaming;

  }

  function handleRenameItemClicked() {
    $('.js-shopping-list').on('click', '.js-item-rename', event => {
      const id = getItemIdFromElement(event.currentTarget);
      toggleRenamingItem(id);
      render();        
    });
  }

  function handleDeleteItemClicked() {
    // like in `handleItemCheckClicked`, we use event delegation
    $('.js-shopping-list').on('click', '.js-item-delete', event => {
      // get the index of the item in store.items
      const id = getItemIdFromElement(event.currentTarget);
      // delete the item
      deleteListItem(id);
      // render the updated shopping list
      render();
    });
  }
  
  function handleEditShoppingItemSubmit() {
    $('.js-shopping-list').on('submit', '.js-item-edit', event => {
      event.preventDefault();
      const id = getItemIdFromElement(event.currentTarget);
      const itemNewName = $(event.currentTarget).find('.shopping-item-edit').val();
      editListItemName(id, itemNewName);
      toggleRenamingItem(id);
      render();
    });
  }
 
  function handleToggleFilterClick() {
    $('.js-filter-checked').click(() => {
      toggleCheckedItemsFilter();
      render();
    });
  }
  
  function handleShoppingListSearch() {
    $('.js-shopping-list-search-entry').on('keyup', event => {
      const val = $(event.currentTarget).val();
      setSearchTerm(val);
      render();
    });
  }
  
  function bindEventListeners() {
    handleNewItemSubmit();
    handleItemCheckClicked();
    handleDeleteItemClicked();
    handleEditShoppingItemSubmit();
    handleToggleFilterClick();
    handleShoppingListSearch();
    handleRenameItemClicked();
  }

  // This object contains the only exposed methods from this module:
  return {
    render,
    bindEventListeners
  };
}());
