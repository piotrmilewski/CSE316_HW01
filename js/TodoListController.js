'use strict'
/**
 * TodoListController.js
 * 
 * This file provides responses for all user interface interactions.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
class TodoListController {
    /**
     * The constructor sets up all event handlers for all user interface
     * controls known at load time, meaning the controls that are declared 
     * inside index.html.
     */
    constructor() {
        // SETUP ALL THE EVENT HANDLERS FOR EXISTING CONTROLS,
        // MEANING THE ONES THAT ARE DECLARED IN index.html

        // FIRST THE NEW LIST BUTTON ON THE HOME SCREEN
        this.registerEventHandler(TodoGUIId.HOME_NEW_LIST_BUTTON, TodoHTML.CLICK, this[TodoCallback.PROCESS_CREATE_NEW_LIST]);

        // THEN THE CONTROLS ON THE LIST SCREEN
        this.registerEventHandler(TodoGUIId.LIST_HEADING, TodoHTML.CLICK, this[TodoCallback.PROCESS_GO_HOME]);
        this.registerEventHandler(TodoGUIId.LIST_NAME_TEXTFIELD, TodoHTML.KEYUP, this[TodoCallback.PROCESS_CHANGE_NAME]);
        this.registerEventHandler(TodoGUIId.LIST_OWNER_TEXTFIELD, TodoHTML.KEYUP, this[TodoCallback.PROCESS_CHANGE_OWNER]);
        this.registerEventHandler(TodoGUIId.LIST_TRASH, TodoHTML.CLICK, this[TodoCallback.PROCESS_DELETE_LIST]);

        // THEN THE CONTROLS ON THE MODAL SCREEN
        this.registerEventHandler(TodoGUIId.MODAL_YES_BUTTON, TodoHTML.CLICK, this[TodoCallback.PROCESS_CONFIRM_DELETE_LIST]);
        this.registerEventHandler(TodoGUIId.MODAL_NO_BUTTON, TodoHTML.CLICK, this[TodoCallback.PROCESS_CANCEL_DELETE_LIST]);

        // THEN THE CONTROLS ON THE ITEM SCREEN
        this.registerEventHandler(TodoGUIId.ITEM_SUBMIT_BUTTON, TodoHTML.CLICK, this[TodoCallback.PROCESS_SUBMIT_ITEM_CHANGES]);
        this.registerEventHandler(TodoGUIId.ITEM_CANCEL_BUTTON, TodoHTML.CLICK, this[TodoCallback.PROCESS_CANCEL_ITEM_CHANGES]);
    }

    /**
     * This function helps the constructor setup the event handlers for all controls.
     * 
     * @param {TodoGUIId} id Unique identifier for the HTML control on which to
     * listen for events.
     * @param {TodoHTML} eventName The type of control for which to respond.
     * @param {TodoCallback} callback The callback function to be executed when
     * the event occurs.
     */
    registerEventHandler(id, eventName, callback) {
        // GET THE CONTROL IN THE GUI WITH THE CORRESPONDING id
        let control = document.getElementById(id);

        // AND SETUP THE CALLBACK FOR THE SPECIFIED EVENT TYPE
        control.addEventListener(eventName, callback);
    }

    /**
     * This function responds to when the user changes the
     * name of the list via the textfield.
     */
    processChangeName() {
        let nameTextField = document.getElementById(TodoGUIId.LIST_NAME_TEXTFIELD);
        let newName = nameTextField.value;
        let listBeingEdited = window.todo.model.listToEdit;
        window.todo.model.updateListName(listBeingEdited, newName);
    }

    processChangeOwner() {
        let ownerTextField = document.getElementById(TodoGUIId.LIST_OWNER_TEXTFIELD);
        let newOwner = ownerTextField.value;
        let listBeingEdited = window.todo.model.listToEdit;
        window.todo.model.updateListOwner(listBeingEdited, newOwner);
    }

    /**
     * This function is called when the user requests to create
     * a new list.
     */
    processCreateNewList() {
        // MAKE A BRAND NEW LIST
        window.todo.model.loadNewList();

        // CHANGE THE SCREEN
        window.todo.model.goList();
    }

    /**
     * This function responds to when the user clicks on a link
     * for a list on the home screen.
     * 
     * @param {String} listName The name of the list to load into
     * the controls on the list screen.
     */
    processEditList(listName) {
        // LOAD THE SELECTED LIST
        window.todo.model.loadList(listName);

        // CHANGE THE SCREEN
        window.todo.model.goList();
    }

    /**
     * This function responds to when the user clicks on the
     * todo logo to go back to the home screen.
     */
    processGoHome() {
        window.todo.model.goHome();
    }

    /**
     * This function creates a dialog to verify if one wishes
     * to delete a list. It will then process that request.
     */
    processDeleteList() {
        window.todo.view.showDialog();
    }

    processConfirmDeleteList() {
        let listBeingDeleted = window.todo.model.listToEdit;
        window.todo.model.removeList(listBeingDeleted);
        window.todo.view.hideDialog();
        setTimeout(function(){ 
            window.todo.model.goHome(); 
        }, 2000);
    }

    processCancelDeleteList() {
        window.todo.view.hideDialog();
    }

    processMoveItemUp(index) {
        let listBeingEdited = window.todo.model.listToEdit;
        listBeingEdited.moveItemUp(index);
        window.todo.view.loadItems(listBeingEdited);
        event.stopPropagation();
    }

    processMoveItemDown(index) {
        let listBeingEdited = window.todo.model.listToEdit;
        listBeingEdited.moveItemDown(index);
        window.todo.view.loadItems(listBeingEdited);
        event.stopPropagation();
    }

    processDeleteItem(index) {
        let listBeingEdited = window.todo.model.listToEdit;
        listBeingEdited.removeItem(index);
        window.todo.view.loadItems(listBeingEdited);
        event.stopPropagation();
    }

    processEditItem(index) {
        let listBeingEdited = window.todo.model.listToEdit;
        listBeingEdited.setNewItem(false);
        listBeingEdited.setIndex(index);

        let itemDescription = document.getElementById(TodoGUIId.ITEM_DESCRIPTION_TEXTFIELD);
        let itemAssignedTo = document.getElementById(TodoGUIId.ITEM_ASSIGNED_TO_TEXTFIELD);
        let itemDueDate = document.getElementById(TodoGUIId.ITEM_DUE_DATE_TEXTFIELD);
        let itemCompleted = document.getElementById(TodoGUIId.ITEM_COMPLETED_CHECKBOX);

        let todoListItem = listBeingEdited.getItemAtIndex(index);

        itemDescription.value = todoListItem.getDescription();
        itemAssignedTo.value = todoListItem.getAssignedTo();
        itemDueDate.value = todoListItem.getDueDate();
        itemCompleted.checked = todoListItem.isCompleted();

        window.todo.model.goItem();
    }

    processCreateNewItem() {
        let listBeingEdited = window.todo.model.listToEdit;
        listBeingEdited.setNewItem(true);

        let itemDescription = document.getElementById(TodoGUIId.ITEM_DESCRIPTION_TEXTFIELD);
        let itemAssignedTo = document.getElementById(TodoGUIId.ITEM_ASSIGNED_TO_TEXTFIELD);
        let itemDueDate = document.getElementById(TodoGUIId.ITEM_DUE_DATE_TEXTFIELD);
        let itemCompleted = document.getElementById(TodoGUIId.ITEM_COMPLETED_CHECKBOX);

        itemDescription.value = "";
        itemAssignedTo.value = "";
        itemDueDate.value = "";
        itemCompleted.checked = false;

        window.todo.model.goItem();
    }

    processSubmitItemChanges() {
        let itemDescription = document.getElementById(TodoGUIId.ITEM_DESCRIPTION_TEXTFIELD);
        let itemAssignedTo = document.getElementById(TodoGUIId.ITEM_ASSIGNED_TO_TEXTFIELD);
        let itemDueDate = document.getElementById(TodoGUIId.ITEM_DUE_DATE_TEXTFIELD);
        let itemCompleted = document.getElementById(TodoGUIId.ITEM_COMPLETED_CHECKBOX);

        let newDescription = itemDescription.value;
        let newAssignedTo = itemAssignedTo.value;
        let newDueDate = itemDueDate.value;
        let newCompleted = itemCompleted.checked;

        let listBeingEdited = window.todo.model.listToEdit;

        if (listBeingEdited.getNewItem()){
            window.todo.model.newListItem(listBeingEdited, newDescription, newAssignedTo, newDueDate, newCompleted);
        }
        else{
            window.todo.model.editListItem(listBeingEdited, newDescription, newAssignedTo, newDueDate, newCompleted);
        }

        window.todo.model.goList();
        window.todo.view.loadItems(listBeingEdited);
    }

    processCancelItemChanges() {
        window.todo.model.goList();
    }

    /**
     * This function is called in response to when the user clicks
     * on the Task header in the items table.
     */
    processSortItemsByTask() {
        // IF WE ARE CURRENTLY INCREASING BY TASK SWITCH TO DECREASING
        if (window.todo.model.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_TASK_INCREASING)) {
            window.todo.model.sortTasks(ItemSortCriteria.SORT_BY_TASK_DECREASING);
        }
        // ALL OTHER CASES SORT BY INCREASING
        else {
            window.todo.model.sortTasks(ItemSortCriteria.SORT_BY_TASK_INCREASING);
        }
    }

    processSortItemsByDueDate() {
        // IF WE ARE CURRENTLY INCREASING BY DUE DATE SWITCH TO DECREASING
        if (window.todo.model.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_DUE_DATE_INCREASING)) {
            window.todo.model.sortTasks(ItemSortCriteria.SORT_BY_DUE_DATE_DECREASING);
        }
        // ALL OTHER CASES SORT BY INCREASING
        else {
            window.todo.model.sortTasks(ItemSortCriteria.SORT_BY_DUE_DATE_INCREASING);
        }
    }

    /**
     * This function is called in response to when the user clicks
     * on the Status header in the items table.
     */
    processSortItemsByStatus() {
        // IF WE ARE CURRENTLY INCREASING BY STATUS SWITCH TO DECREASING
        if (window.todo.model.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_STATUS_INCREASING)) {
            window.todo.model.sortTasks(ItemSortCriteria.SORT_BY_STATUS_DECREASING);
        }
        // ALL OTHER CASES SORT BY INCREASING
        else {
            window.todo.model.sortTasks(ItemSortCriteria.SORT_BY_STATUS_INCREASING);
        }
    }
}