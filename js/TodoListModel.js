'use strict'
/**
 * TodoListModel.js
 * 
 * This class provides access to all the data, meaning all of the lists. Note
 * that in order to make testing easier we are loading all the lists at the
 * start when the page first loads and then we can edit those lists one at a
 * time. If this were a site with a backend we would only load the lists as
 * needed.
 * 
 * This class provides methods for changing data, including things like the 
 * current navigation state and which list is being edited as well as access
 * to all the lists data.
 * 
 * Note that we are employing a Model-View-Controller (MVC) design strategy
 * here so that when data in this class changes it is immediately reflected
 * inside the view of the page.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
class TodoListModel {
    /**
     * 
     * @param {TodoListView} initView 
     */
    constructor(initView) {
        this.view = initView;

        // WE DON'T HAVE A DATABASE SO WE NEED TO KEEP
        // ALL OF THE LISTS WE MAKE HERE
        this.todoLists = new Array();

        // NO LIST IS BEING EDITED JUST YET
        this.listToEdit = null;
    }

    /**
     * Set the list that is to be edited so we can update it as the user makes changes.
     * 
     * @param {TodoList} initListToEdit List to edit.
     */
    setListToEdit(initListToEdit) {
        this.listToEdit = initListToEdit;
        if (this.listToEdit) {
            this.moveListToTop(this.listToEdit);            
            this.view.loadListData(this.listToEdit);
        }
    }

    /**
     * Appends the list to the list of lists.
     * 
     * @param {TodoList} listToAppend List to append to the list of lists.
     */
    appendList(listToAppend) {
        this.todoLists.push(listToAppend);
        this.view.appendListLink(listToAppend);
    }

    /**
     * Prepends the list to the list of lists.
     * 
     * @param {TodoList} listToPrepend List to prepend to the list of lists.
     */
    prependList(listToPrepend) {
        this.todoLists.unshift(listToPrepend);
        this.view.loadListLinks(this.todoLists);
    }

    /**
     * Removes the list from the list of lists.
     * 
     * @param {TodoList} listToRemove List to remove, presumably it's been deleted.
     */
    removeList(listToRemove) {
        // REMOVE IT IF IT EXISTS
        let indexOfList = this.todoLists.indexOf(listToRemove);
        if (indexOfList >= 0)
            this.todoLists.splice(indexOfList, 1);
        this.view.loadListLinks(this.todoLists);
    }

    /**
     * Gets and returns the number of items in the list being edited.
     */
    getNumItems() {
        if (this.listToEdit) {
            return this.listToEdit.items.length;
        }
        else {
            return 0;
        }
    }

    /**
     * Tests to see if an item is being edited. If it is, true is returned,
     * else false.
     */
    isEditingItem() {
        return this.editItem != null;
    }

    /**
     * This function moves listToMove to the top of the list of lists
     * that can be edited, which will be reflected on the welcome page.
     */
    moveListToTop(listToMove) {
        // REMOVE THE LIST IF IT EXISTS
        this.removeList(listToMove);

        // AND THEN ADD IT TO THE TOP OF THE STACK
        this.prependList(listToMove);
    }

    /**
     * This function will navigate the user to the home (i.e. welcome) screen.
     */
    goHome() {
        let home = document.getElementById(TodoGUIId.TODO_HOME);
        home.classList.remove(TodoGUIClass.DISPLAY_OFF);

        // THIS COULD HAPPEN ANYWHERE SO HIDE ALL THE OTHERS
        this.view.showElementWithId(TodoGUIId.TODO_LIST, false);
        this.view.showElementWithId(TodoGUIId.TODO_ITEM, false);

        // AND GO HOME
        this.view.showElementWithId(TodoGUIId.TODO_HOME, true);        
    }

    /**
     * This function will navigate the user to the list screen where they
     * may edit a list.
     */
    goList() {
        let home = document.getElementById(TodoGUIId.TODO_HOME);
        home.classList.add(TodoGUIClass.DISPLAY_OFF);

        // THIS MIGHT HAVE OCCURED FROM HOME SO HIDE HOME
        this.view.showElementWithId(TodoGUIId.TODO_HOME, false);
        this.view.showElementWithId(TodoGUIId.TODO_ITEM, false);

        // SHOW THE TOOLBAR AND LIST EDIT
        this.view.showElementWithId(TodoGUIId.TODO_LIST, true);
    }

    goItem() {
        let home = document.getElementById(TodoGUIId.TODO_HOME);
        home.classList.add(TodoGUIClass.DISPLAY_OFF);

        // THIS MIGHT HAVE OCCURED FROM HOME SO HIDE HOME
        this.view.showElementWithId(TodoGUIId.TODO_HOME, false);
        this.view.showElementWithId(TodoGUIId.TODO_LIST, false);

        // SHOW THE TOOLBAR AND LIST EDIT
        this.view.showElementWithId(TodoGUIId.TODO_ITEM, true);
    }

    newListItem(listBeingEdited, newDescription, newAssignedTo, newDueDate, newCompleted) {
        let todoListItem = new TodoListItem();

        todoListItem.setDescription(newDescription);
        todoListItem.setAssignedTo(newAssignedTo);
        todoListItem.setDueDate(newDueDate);
        todoListItem.setCompleted(newCompleted);

        listBeingEdited.addItem(todoListItem);
    }

    editListItem(listBeingEdited, newDescription, newAssignedTo, newDueDate, newCompleted) {
        let index = listBeingEdited.getIndex();
        let todoListItem = listBeingEdited.getItemAtIndex(index);

        todoListItem.setDescription(newDescription);
        todoListItem.setAssignedTo(newAssignedTo);
        todoListItem.setDueDate(newDueDate);
        todoListItem.setCompleted(newCompleted);
    }

    /**
     * Changes the name of the list being edited.
     * 
     * @param {TodoList} listBeingEdited List in the process of being edited.
     * @param {String} newName The new name of the list.
     */
    updateListName(listBeingEdited, newName) {
        // WE'RE GOING TO CHANGE THE NAME TOO BUT ONLY UPDATE
        // THE LIST OF LIST LINKS IF IT'S CHANGED
        if (listBeingEdited.getName() != newName) {
            listBeingEdited.setName(newName);
            this.view.loadListLinks(this.todoLists);
        }
    }

    updateListOwner(listBeingEdited, newOwner) {
        if (listBeingEdited.getOwner() != newOwner) {
            listBeingEdited.setOwner(newOwner);
            this.view.loadListLinks(this.todoLists);
        }
    }

    /**
     * This method creates a new list and sets it up so that it
     * can be edited.
     */
    loadNewList() {
        this.listToEdit = new TodoList();
        this.prependList(this.listToEdit);
        this.view.loadListData(this.listToEdit);
    }

    /**
     * This method will retrieve the list stored under the listName id
     * and will load it so it is ready to edit.
     * 
     * @param {String} listName The name of the list to load.
     */
    loadList(listName) {
        // FIRST FIND THE LIST WITH THE GIVEN NAME
        let listToLoad = null;
        for (let i = 0; i < this.todoLists.length; i++) {
            let testList = this.todoLists[i]; 
            if (testList.getName() === listName) {
                listToLoad = testList;
                i = this.todoLists.length;
            }
        }

        if (listToLoad != null) {
            this.setListToEdit(listToLoad);
        }
    }

    /**
     * This method sorts the todo list items according to the provided sorting criteria.
     * 
     * @param {ItemSortCriteria} sortingCriteria Sorting criteria to use.
     */
    sortTasks(sortingCriteria) {
        this.currentItemSortCriteria = sortingCriteria;
        this.listToEdit.items.sort(this.compare);
        this.view.loadItems(this.listToEdit);
    }

    /**
     * This method tests to see if the current sorting criteria is the same as the argument.
     * 
     * @param {ItemSortCriteria} testCriteria Criteria to test for.
     */
    isCurrentItemSortCriteria(testCriteria) {
        return this.currentItemSortCriteria === testCriteria;
    }

    /**
     * This method compares two items for the purpose of sorting according to what
     * is currently set as the current sorting criteria.
     * 
     * @param {TodoListItem} item1 First item to compare.
     * @param {TodoListItem} item2 Second item to compare.
     */
    compare(item1, item2) {
        let thisModel = window.todo.model;

        // IF IT'S A DECREASING CRITERIA SWAP THE ITEMS
        if (thisModel.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_TASK_DECREASING)
            || thisModel.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_DUE_DATE_DECREASING)
            || thisModel.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_STATUS_DECREASING)) {
            let temp = item1;
            item1 = item2;
            item2 = temp;
        }
        // SORT BY ITEM DESCRIPTION
        if (thisModel.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_TASK_INCREASING)
            || thisModel.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_TASK_DECREASING)) {
            if (item1.getDescription() < item2.getDescription())
                return -1;
            else if (item1.getDescription() > item2.getDescription())
                return 1;
            else
                return 0;
        }
        // SORT BY DUE DATE
        else if (thisModel.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_DUE_DATE_INCREASING)
            || thisModel.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_DUE_DATE_DECREASING)) {
            if (item1.getDueDate() < item2.getDueDate())
                return -1;
            else if (item1.getDueDate() > item2.getDueDate())
                return 1;
            else
                return 0;
        }
        // SORT BY COMPLETED
        else {
            if (item1.isCompleted() < item2.isCompleted())
                return -1;
            else if (item1.isCompleted() > item2.isCompleted())
                return 1;
            else
                return 0;
        }
    }
}