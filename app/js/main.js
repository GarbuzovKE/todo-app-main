import ToDoList from "./todolist.js";
import ToDoItem from "./todoitem.js";

const toDoList = new ToDoList();

//Launch app
document.addEventListener("readystatechange", (event) => {
  if (event.target.readyState === "complete") {
    initApp();
  }
});

const initApp = () => {
  //Add listeners
  const addItemForm = document.getElementById("add-item-form");
  addItemForm.addEventListener("submit", (event) => {
    event.preventDefault();
    processSubmission();
  });

  const clearCompleted = document.getElementById("clear-button");
  clearCompleted.addEventListener("click", (event) => {
    toDoList.clearCompleted();
    updatePersistentData(toDoList.getList());
    refreshThePage();
  });

  const statusBars = document.getElementsByClassName("status-bar");
  for (let statusBar of statusBars) {
    for (let statusBarButton of statusBar.children) {
      statusBarButton.addEventListener("click", (event) => {
        deselectAllStatuses();
        event.target.classList.toggle("selected");
        const appStatus = event.target.textContent;
        updatePersistentData(undefined, appStatus);
        refreshThePage();
      });
    }
  }

  const themeToggle = document.getElementById("theme-toggle");
  themeToggle.addEventListener("click", (event) => {
    changeTheme();
  });

  //Procedural
  setAppDataToLocalStorage();
  loadListObject();
  refreshThePage();
  renderAppStatus();
  updateTheme();
};

const loadListObject = () => {
  const storedList = localStorage.getItem("toDoListArray");
  if (typeof storedList !== "string") return;
  const parsedList = JSON.parse(storedList);
  parsedList.forEach((itemObject) => {
    const newToDoItem = createNewItem(
      itemObject._id,
      itemObject._item,
      itemObject._completed
    );
    toDoList.addItemToList(newToDoItem);
  });
};

const refreshThePage = () => {
  clearListDisplay();
  renderList();
  clearItemEntryField();
  //setFocusOnItemEntry();
  setItemsLeft();
};

const clearListDisplay = () => {
  const parentElement = document.getElementById("list-container");
  deleteContents(parentElement);
};

const deleteContents = (parentElement) => {
  let firstItem = parentElement.getElementsByClassName("item")[0];
  while (firstItem) {
    parentElement.removeChild(firstItem);
    firstItem = parentElement.getElementsByClassName("item")[0];
  }
};

const renderList = () => {
  const storedAppStatus = localStorage.getItem("appStatus");
  const appStatus = JSON.parse(storedAppStatus);
  const list = toDoList.getList();
  list.forEach((item) => {
    if (appStatus == "All") {
      buildListItem(item);
    } else if (appStatus == "Active" && !item.getState()) {
      buildListItem(item);
    } else if (appStatus == "Completed" && item.getState()) {
      buildListItem(item);
    }
  });
};

const renderAppStatus = () => {
  const storedAppStatus = localStorage.getItem("appStatus");
  const appStatus = JSON.parse(storedAppStatus);

  const statusBars = document.getElementsByClassName("status-bar");
  for (let statusBar of statusBars) {
    for (let statusBarButton of statusBar.children) {
      if (
        statusBarButton.textContent == appStatus &&
        !statusBarButton.classList.contains("selected")
      ) {
        statusBarButton.classList.toggle("selected");
      }
      if (
        statusBarButton.textContent != appStatus &&
        statusBarButton.classList.contains("selected")
      ) {
        statusBarButton.classList.toggle("selected");
      }
    }
  }
};

const clearItemEntryField = () => {
  document.getElementById("new-item").value = "";
};

const setFocusOnItemEntry = () => {
  document.getElementById("new-item").focus();
};

const processSubmission = () => {
  const newEntryText = getNewEntry();
  if (!newEntryText.length) return;
  const nextItemId = calcNextItemId();
  const toDoItem = createNewItem(nextItemId, newEntryText);
  toDoList.addItemToList(toDoItem);
  updatePersistentData(toDoList.getList());
  refreshThePage();
};

const getNewEntry = () => {
  return document.getElementById("new-item").value.trim();
};

const calcNextItemId = () => {
  let nextItemId = 1;
  const list = toDoList.getList();
  if (list.length > 0) {
    nextItemId = list[list.length - 1].getId() + 1;
  }
  return nextItemId;
};

const createNewItem = (itemId, itemText, itemCompleted = false) => {
  const toDo = new ToDoItem();
  toDo.setId(itemId);
  toDo.setItem(itemText);
  if (itemCompleted) {
    toDo.changeState();
  }
  return toDo;
};

const buildListItem = (item) => {
  const div = document.createElement("div");
  div.className = "item";
  const item__label = document.createElement("label");
  item__label.className = "item__label";
  const check = document.createElement("input");
  check.type = "checkbox";
  check.id = item.getId();
  check.tabIndex = -1;
  if (item.getState()) {
    check.checked = true;
  }
  addClickListenerToCheckbox(check, item);
  const customCheckbox = document.createElement("span");
  customCheckbox.className = "custom-checkbox";
  customCheckbox.tabIndex = "0";
  const iconCheck = document.createElement("img");
  iconCheck.src = "./images/icon-check.svg";
  iconCheck.alt = "check";
  const customCheckbox__fill = document.createElement("div");
  customCheckbox__fill.className = "custom-checkbox__fill";
  const itemContent = document.createElement("label");
  itemContent.htmlFor = item.getId();
  itemContent.textContent = item.getItem();
  itemContent.className = "text-sm";

  customCheckbox.appendChild(iconCheck);
  customCheckbox.appendChild(customCheckbox__fill);
  item__label.appendChild(check);
  item__label.appendChild(customCheckbox);
  item__label.appendChild(itemContent);

  const removeButton = document.createElement("button");
  removeButton.className = "remove-item";
  removeButton.title = "Remove the item";
  const crossImg = document.createElement("img");
  crossImg.src = "./images/icon-cross.svg";
  crossImg.alt = "remove item";

  removeButton.appendChild(crossImg);
  addClickListenerToRemoveItem(removeButton, item);

  div.appendChild(item__label);
  div.appendChild(removeButton);

  const container = document.getElementById("list-container");
  const list__footer = document.querySelector(".list-container__footer");
  container.insertBefore(div, list__footer);
};

const addClickListenerToCheckbox = (checkbox, item) => {
  checkbox.addEventListener("click", (event) => {
    setTimeout(() => {
      item.changeState();
      updatePersistentData(toDoList.getList());
      refreshThePage();
    }, 200);
  });
};

const addClickListenerToRemoveItem = (button, item) => {
  button.addEventListener("click", (event) => {
    const id = item.getId();
    toDoList.removeItemFromList(id);
    updatePersistentData(toDoList.getList());
    refreshThePage();
  });
};

const setItemsLeft = () => {
  const itemsLeftElement = document.getElementsByClassName("items-left")[0];
  const itemsLeftNumber = document.getElementsByClassName("item").length;
  itemsLeftElement.innerHTML = `${itemsLeftNumber} items left`;
};

const setAppDataToLocalStorage = () => {
  if (!localStorage.getItem("appStatus")) {
    localStorage.setItem("appStatus", JSON.stringify("All"));
  }
};

const deselectAllStatuses = () => {
  const statuses = document.querySelectorAll(".selected");
  for (let status of statuses) {
    status.classList.toggle("selected");
  }
};

const updatePersistentData = (listArray = null, appStatus = null) => {
  if (listArray) {
    localStorage.setItem("toDoListArray", JSON.stringify(listArray));
  }
  if (appStatus) {
    localStorage.setItem("appStatus", JSON.stringify(appStatus));
  }
};

const changeTheme = () => {
  const dataTheme = document.body.getAttribute("data-theme");
  if (dataTheme == "light") {
    document.body.setAttribute("data-theme", "dark");
    localStorage.setItem('theme', JSON.stringify('dark'))
  } else {
    document.body.setAttribute("data-theme", "light");
    localStorage.setItem('theme', JSON.stringify('light'))
  }
};

const updateTheme = ()=>{
  const storedTheme = localStorage.getItem('theme');
  const theme = JSON.parse(storedTheme);
  if (theme){
    document.body.setAttribute('data-theme', theme);
  }
}